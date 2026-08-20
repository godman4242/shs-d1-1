# BLIND CRITIC — src-npcdata (HUNTER LENS)

Packet: `docs/gauntlet/L0/worklist/src-npcdata.claims.json` — **35 claims, 35 judged, 0 skipped.**
Source artifact: `reference/extracted/npcdata.xml` (9,625 lines, 495 `<npc>`).
Surveyor prose (`docs/gauntlet/L0/sources/npcdata.md`) NOT read, per §3.2.

Every verdict below rests on an artifact **I** opened this turn. Where I quote a number, I
re-derived it first-hand; the derivation commands are inline.

---

## 0. First-hand tag census (basis for many verdicts)

Re-derived over all 495 `<npc>` blocks of `reference/extracted/npcdata.xml`:

```
1273 id · 1049 lvl · 647 skill · 495 npc · 495 mcs · 490 name · 489 pants · 479 armor
472 shoes · 470 weapon · 462 hair · 425 ai · 406 attack · 403 hp · 394 defense · 287 hat
217 prop1 · 131 mask · 131 loot · 131 qty · 131 chance · 115 head · 96 skills · 66 reward
58 gloves · 29 neck · 16 scalex · 16 scaley · 3 earth · 1 fire · 1 prop2
```
Zero occurrences of: `<speed> <chi> <exp> <coins> <xp> <wind> <water> <forshow>`
`<armorpcolor> <pantspcolor> <hatpcolor> <maskpcolor> <rightpos>`.

This matches `docs/gauntlet/L0/index/npcdata.json` exactly and underwrites claims
3, 9, 12, 18, 21, 22, 24, 27.

---

## 1. VERDICTS

### REFUTED (5)

**[2] `npcdata/absent-boss-names` — REFUTED, material.**
The claim's operative assertion is *"they are currently unsourced against any artifact we
hold."* That is false for four of the five names.

- **Shira Tancho is the player's own clan.** `reference/extracted/questdata.xml:514`
  — `<text>But these retainers, all with the exception of Shinmen, they're not Shira Tancho men. They're outsiders.</text>`
  `grep -ioc "shira tancho" reference/extracted/questdata.xml` → **104**.
  Named members appear at :560 (Ito, Takahasi, Yuudai), :550 ("the Shira Tancho Old Guard").
  And `npcdata.xml:2418` is NPC id 90, name string 5012→**"Old Guard"**, `<ai>30</ai>`
  (FriendlyElite) — the clan has an NPC row.
  The ledger line the claim tries to overturn ("Shira Tancho story-only") is **correct**.
- **Hachisuka and Honda are surname-table entries.**
  `reference/extracted/bindata/96_1t4652s0.bin` (plain ASCII, CRLF-delimited, 289 B) is the
  SamuraiFamilyNames table: `Asai\r\nAskikaga\r\nChosokabe\r\nDate\r\nFukushima\r\nGenji\r\n`
  **`Hachisuka`** `\r\nHattori\r\nHeike\r\nHojo\r\n`**`Honda`**`\r\nHosokawa\r\n…`
  (offsets 51 and 84). Confirmed identical in `reference/extracted/android/87_NameGenerator_SamuraiFamilyNames.bin`.
- **Kano is a male given name** — `reference/extracted/bindata/94_1t4651s0.bin` offset 692
  (`…Kane\r\nKano\r\nKaori\r\n…`).
- **Shizuka is a female given name** — `reference/extracted/bindata/97_1t4650s0.bin` offset
  1620 (`…Shiori\r\nShizue\r\nShizuka\r\nShizuyo\r\n…`).

So **"Hachisuka Kano" and "Honda Shizuka" are procedurally generated NPC names**
(family + given), produced by `XMLNpc.initProcGenNPC` → `NameGenerator.getSamuraiName(rng,male)`
(`reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:529`) — i.e. exactly the
mechanism claim 28 in this same packet describes. They are not missing bosses.
Only **Zabuza, Tengu, Hotaru** survive as genuinely unfound (0 hits across
`reference/extracted/*.xml`, all 27 bindata blobs, all 42 android blobs, and
`reference/decompiled/`).

**[4] `npcdata/ai-taxonomy` — REFUTED, minor.**
"maps **one-to-one** onto **38** named actor classes" is wrong. The switch at
`reference/decompiled/shs3_android_payload/scripts/NPCManager.as:516-634` has 38 `case`
arms but only **35 distinct classes**:
- `EnemyPlayer` serves **ai 0, 9, 14** — `new EnemyPlayer(MCSPool.getMCS(),true,false)` /
  `(…,false,false)` / `(…,false,true)`; constructor
  `public function EnemyPlayer(mcs:MCSCharacter = null, isDuelist:Boolean = false, isBoss:Boolean = false)`
  at `EnemyPlayer.as:40`.
- `EnemySpearElite` serves **ai 28 and 37** (`(…,false)` / `(…,true)`).

The lane text "38 named classes to read" would send a builder looking for 38 files that do
not exist. Substance (a total ai→class map, three `Friendly*` classes at cases 30/31/34,
`EnemyVegePatch` at case 20) is verified and survives.

**[6] `npcdata/build-parity` — REFUTED, minor (conclusion survives).**
The pasted A3 output is self-contradictory: it prints `web bytes 218792 android(no decl)
bytes 218793` and then `IDENTICAL: True`. 218792 ≠ 218793, so they cannot be byte-identical.
I re-ran the same normalisation (strip BOM, strip `<?xml …?>`, CRLF→LF):

```
web norm chars 218792 · android norm chars 218793 · IDENTICAL: False
unified diff (web vs android):  @@ -9626 +9626,2 @@   </npcdata>  +
```
Exactly **one** difference: the Android blob carries a trailing empty line. The correct
statement is **content-identical, not byte-identical**. The lane conclusion — every number
in this survey is a web-v0.717 number as well as an Android-v0.682 one — is **confirmed by
my own diff** and stands.

**[20] `npcdata/named-boss-hp-authored` — REFUTED, material.**
Two halves; the first stands, the second does not.
- Stands: `src/config/combat-sim.ts` `ENEMY_BASE` really does carry the comment
  *"Named-enemy HP is not authored at all…"*, and the payload really does author HP —
  `npcdata.xml:3125` `<hp>1000</hp>` (Hiroshi), :4076 `<hp>800</hp>`, :3846 `<hp>600</hp>`,
  361 rows with `hp != 1`.
- **Fails:** *"the max()-is-a-no-op reasoning that justified hp:1 rests on a false premise."*
  The premise is real code. `reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as`:
  ```
  :73   factor = lvl / level;   :77   maxhp *= factor;
  :97   hitsToKillBoss = 8 + lvldiff;      :98  hitsToKillPlayer = 16 - lvldiff;
  :107  playerhit = playerATK - defense;   (level-banded floors :108-123)
  :124  bossHP = playerhit * hitsToKillBoss;
  :125  if(bossHP > maxhp) { maxhp = bossHP; setHP(maxhp); }
  :131  bosshit = playerHP / hitsToKillPlayer;  :132 bossATK = bosshit + playerDEF;
  :133  if(bossATK > minDamage) { minDamage = bossATK; }
  ```
  That is literally `maxhp = max(levelScaledAuthoredHP, effPlayerDmg × K)`. And
  `NPC.as:253-259` hard-clamps `damage = 1; defense = 1; maxhp = 1;` for `lvl <= 10`.
  So the shipped `hp: 1` is not resting on a false premise — only the comment's clause
  *"not authored at all"* is wrong; the authored value is the **other arm of the max()**,
  after level scaling. The ledger note should be "wording wrong, model right", not
  "the derived-HP model rests on a false premise."

**[23] `npcdata/npc-elemental-typing` — REFUTED, minor (its STILL_UNHELD half is found).**
The data half is exact (4 rows: :3380 `<fire>10</fire>`, :3439/:4039/:4272 `<earth>10</earth>`;
matching skills confirmed — npc 161 carries id 1013 = `strings.json["6036"]` "Fire Breath",
desc `["6037"]` "Close-ranged fire attack" (`skilldata.xml:607`); npcs 164/197/809 carry id
1033 = `["6074"]` "Ground Punch", desc `["6075"]` "Close-ranged earth attack." (`skilldata.xml:1048`)).
But the claim's PARTIAL says *"what the scalar 10 means (resist / affinity / bonus) is
STILL_UNHELD."* It is not — **the packet's own claim 10 cites the answer**:
`reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:194-198`
```
if(xml.fire.toString() != "")
{
   this.STAT_FIREATK = xml.fire;
   this.STAT_EARTHDEF = xml.fire;
}
```
The scalar is simultaneously that element's **attack** stat and the opposing element's
**defence** stat. Also: "elements are a LIVE combat channel on **ordinary** NPCs" is
misleading — all four rows are `<ai>30</ai>`/`<ai>34</ai>`, i.e. **allies**, exactly as
claim 9 in the same packet says.

**[33] `npcdata/unresolved-name-5017` — REFUTED, material.**
The claim states 5017 *"has no entry in the Android EN table."* **It has one.**
`reference/extracted/android/118_Mobile_Lang_EN.bin`, decoded UTF-16LE, lines 4162-4164:
```
<trans-unit id="1385" resname="5017">
<source></source>
</trans-unit>
```
It sits inside an unbroken NPC-archetype run — 5015 "Soldier", 5016 "Pugilist", **5017 ""**,
5018 "Merchant", 5019 "Old man", 5020 "General" — and is one of **21 empty-`<source>`
trans-units** in the 2,555-entry table (`665, 820, 5002, 5017, 5022, 5023, 5024, 5025,
5034, 7003, 7041, 9000, IDS_Q0TITLE, …`).
So NPCs 50-55 are **deliberately nameless** — the nameplate renders an empty string — not a
data gap, and not something to "not guess" about. Everything else in the claim is exact
(six rows ids 50-55 at :1558/:1574/:1590/:1606/:1622/:1638; `<name>` at +2 = :1560…:1640;
ai 7,7,7,7,32,33; npc 55 `<head>8500…8506</head>` at :1646 and `<pants>11503</pants>` at :1648).
⚠ Note the byte-grep trap from §0 applies here — this file is UTF-16LE and a raw grep for
`5017` returns nothing.

---

### HELD — verified first-hand (30)

| # | id | what I re-derived myself | result |
|---|----|--------------------------|--------|
| 0 | frames/pillarbox-52px | per-column mean-luminance of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080): cols 0-51 ≤1.1 · **col 52 = 40.8** · col 53 = 86.5 · col 1866 = 72.9 · col 1867 = 33.1 · col 1868 = 1.3 · cols 1869-1919 ≤1.1. Crop (0,300)-(200,800) ×3 NEAREST: solid black band then stone-wall art. 1816/1080 = **1.6815** (5:3 = 1.6667, 0.89% off); scale 1816/1920 = **0.9458** | EXACT |
| 1 | frames/pillarbox-confirmed | same frame + `Nr4fQstqHDM_431.5.png` (col 51 = 1.6, col 52 = 43.4, col 1867 = 31.9). Content 53…1866 = 1814 px, aspect **1.6796**; (1920−1814)/1920 = 5.5% | EXACT. Incidental only: the "kasa-wearing enemy collapsing bottom-left" is in the **left** half, outside the cited (960,300)-(1920,760) crop; the orange coin-pouch projectile **is** inside it |
| 3 | npcdata/ai-profile-table | ai distribution re-derived: 34 distinct, sums to 425. ai1×56 ai2×48 ai3×52 ai4×47 ai5×48 ai6×3 ai9×**73** ai13×1 ai14×15 ai26×8 ai28×24 — every quoted count exact. Unused in 0..37: **{0, 10, 15, 16}**. `npcdata.xml:27` = `<ai>1</ai>` | EXACT. Loose gloss: "boss-unique profiles ai29–ai37" — ai29×10, ai30×8, ai34×3, and 30/31/34 are **ally** classes |
| 5 | npcdata/boss-movesets | 96 `<skills>`, 647 `<skill>`, **16** distinct moveset strings; the exact standard elite kit occurs **73×**; `skilldata.xml:1948` `<id>1500</id>` `:1949 <category>11</category>` and `:1960 <id>1501</id>` with empty chi/cooldown/desc | counts EXACT — see correction below |
| 7 | npcdata/compositing-contract | `MCSCharacter.as:585` `var xmlItem:XMLItem = QuestEngine.getItemData(id);` → `:592 art = xmlItem.art;`; z-order `:682-683` (component idx 0), `:754-755` (headMask idx 1), `:706` (hatHair idx 2), `:724` (hair idx 3); bones `:832`/`:843` (l_hand/r_hand), `:1265` (prop2). All six web classes exist: `reference/decompiled/shs3_payload/scripts/{torso4000,pelvic4000,thigh11000,foottop12000,neck10000,prop13000}.as` | EXACT |
| 8 | npcdata/damage-is-a-range | `XMLNpc.as:358-364` verbatim; the `trace()` at `:350` names `XMLNpc.initDuelist()` — the PvP caveat is honest and correct | EXACT |
| 9 | npcdata/elemental-roster-empty | 3 `<earth>`, 1 `<fire>`, **0** `<water>`, **0** `<wind>`; all four rows ai 30/30/34/34 = Friendly | EXACT |
| 10 | npcdata/elemental-wheel | `XMLNpc.as:194-213` (fire→FIREATK+EARTHDEF, wind→WINDATK+WATERDEF, water→WATERATK+FIREDEF, earth→EARTHATK+WINDDEF) and `:334-337` restated for players | EXACT |
| 11 | npcdata/enemy-render-scale | 16 `<scalex>`/`<scaley>` pairs; scalex domain **{0.95, 0.99, 1, 1.1, 1.3, 2}**; :4136-4137 = `<scalex>2</scalex><scaley>2</scaley>` (npc 802 Guardian); :3408-3409 = 1.3/1.1 (npc 162 Inokichi); :3437-3438 = 1/0.95 (npc 164 Fumio) | EXACT |
| 12 | npcdata/enemy-skill-loadouts | 96/647/**39** distinct ids; `:535`, `:3898`, `:3934`, `:3662`, `:3436` are each the literal `<skills>` line; Gojo (npc 190, block :3917) = 1501@3, Jump, Roll@3, Dash R/L, **Shunpo**, Slash Wave@2, Chi Punch, Chi Kick, **Spirit Thief**, **Heavenly Sword@3**, Back Throw, Air Stab, **Undying**; Aboshi (npc 175) = …Throw Kunai, **Smoke Bomb@2**, **Substitution Jutsu@2**, **Shadow Clone**; skill 1039 carried by exactly **6** NPCs; `strings.json["6082"]` = `Shunpo`; `strings.json["6085"]` = *"Ultimate Light Stance technique. \n\nHold down the skill icon to increase the damage it inflicts.\n\nThis skill can only be used when in Light Stance."* | EXACT (verbatim) |
| 13 | npcdata/five-clan-armies | 285 army rows = **57.6%** of 495; five 57-row ladders; base Soldier armor 4038/4041/4044/4047/4053 at :4451/:5486/:6521/:7556/:8591; Castle Guard armor 4040/4043/4046/4049/4052 + hat 7024/7025/7026/7027/7029 at :5392/:6427/:7462/:8497/:9532; army rows carrying `<reward>` = **0** | EXACT. Minor: "differing **only** by armour and hat" — `<mask>` differs on 2 of the 57 offsets and `<name>` on 4 |
| 14 | npcdata/friendly-npcs | exactly **12** rows with ai∈{30,31,34}: 90 Old Guard(30) :2418 · 161 Satoshi(30) :3365 · 164 Fumio(30) :3424 · 168 Yuudai(31) :3506 · 181 Hachimaru(30) :3760 · 182 Shou(30) :3777 · 197 Mitsuo(34) :4021 · 806 Soldier(30) :4198 · 807 Soldier(34) :4217 · 809 Mitsuo(34) :4256 · 811 Chikako(30) :4293 · 812 Scout(30) :4313. `NPCManager.as:608/611/620` | EXACT |
| 15 | npcdata/heavy-stance-def-penalty | `skilldata.xml:162-164` → skill 1002, `<desc>6005</desc>`; `strings.json["6005"]` = *"Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\n**Defense -20%**"*; `["6001"]` "…Effective against Heavy Stance."; `["6003"]` "Balanced stance.\nEffective against Light Stance." Ring closes. 1002 carried by **79** NPCs | EXACT (verbatim) |
| 16 | npcdata/high-band-coefficients | npc 248 lvl45 → 113/113/**126** (2.5·45=112.5→113; 2.8·45=126 exactly); npc 252 lvl70 → 175/175/175. `<lvl>` domain includes 45/50/55/60 ×10 each and 70 ×5 | EXACT |
| 17 | npcdata/level-stat-formula | ran the stated piecewise formula against **all 285** army rows: **0 violations**; "checked 225 army NPCs lvl>=11" reproduced exactly (my lvl≥11 count = 225). Cited block starts :4665(212) :4861(223) :5298(247) :5317(248) :5392(252) all correct; values 11→28/27/27, 20→50/48/48, 40→100/96/96, 45→113/113/126, 70→175/175/175 | **EXACT — strongest claim in the packet** |
| 18 | npcdata/loot-drop-tables | 66 `<reward>`, **131** `<loot>`; `<chance>` domain **exactly {0.05, 0.1, 0.3, 0.4, 0.5, 1}**; `<qty>` **{1,2,3,5}**; `<loot><id>` domain **{0,1,2,3,2112,2113,2114,20028}**; :530-532 = id 2/qty 1/chance 1; :1859-1861 = 20028/1/0.5; resolved: 2112 Small Meat, 2113 Meat, 2114 Large Meat, 20028 Animal Fang. Zero `<xp>`/`<coins>` anywhere | EXACT |
| 19 | npcdata/loot-enum-and-coins-per-kill | `NPC.as:805-806` `chance = loot.chance * 100; if(chance == 100 || Math.random() * 100 < chance)`; `:837-856` the lootType 0/1/2/3/else ladder verbatim. I computed expected coins for all 66 reward blocks: **max = 10.0, Mercenery Captain (npc 39, reward at :1235-1241 = id 1 × qty 2 × chance 1)** | EXACT. Minor: the per-NPC expectation set is {0.5, 0.75, 1.0, 1.5, 2.5, 3.0, 5.0, 10.0}; 0.5 sits below the quoted "~0.75–2.5" band (8 NPCs) |
| 21 | npcdata/no-kill-xp | `XMLReward.as:6` `public var exp:int;` and `:20-23` `if(xml.exp.toString() == "") { this.exp = 0; }`; npcdata `<exp>` count = **0**; 495−66 = **429** rows with no `<reward>` | EXACT — but the lead it opens is now CLOSED, see NF5 |
| 22 | npcdata/no-speed-no-chi | `XMLNpc.as:151-158` (chi default 1) and `:175-182` (speed default 1); npcdata `<speed>`/`<chi>` count = **0** each | EXACT — localisation correct, and I closed part of it, see NF11 |
| 24 | npcdata/one-hp-field-trash | `<hp>1</hp>` census = **42**, resolved through `strings.json`: **Soldier 25 · Ruffian 5 · Elite Soldier 5 · Novice Swordsman 3 · Thug 1 · Deer 1 · Fox 1 · Training Dummy 1**. `npcdata.xml:26` = `<hp>1</hp>` in npc 1 "Ruffian" (lvl 3, ai 1, attack 3, defense 0) | **EXACT to the row** |
| 25 | npcdata/paperdoll-12-slots | `npcdata.xml:7-19` is npc 0's `<mcs>` with exactly the 11 tags quoted, `</mcs>` at :19; `:3954` = `<prop2>13057</prop2>`; itemdata band↔type histogram re-derived over 982 items — **every one of the 13 pairs matches the quoted counts** (4000s NONE 152 · 5000s→1 35 · 6000s→2 73 · 7000s→3 97 · 8000s→4 38 · 9000s→5 60 · 10000s→6 14 · 11000s→7 93 · 12000s→8 55 · 13000s→9 177 · 2000s→10 98 · 3000s→11 9 · 20000s→12 79) | EXACT. Minor: "**zero** ambiguity" overstates by 2/982 — one 2000-band item is typed 12, one 7000-band item has no `<type>` |
| 26 | npcdata/paperdoll-13-slots | `XMLNpc.as:36` `DEFAULT_EQSTRING = "4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0"` — **13 fields**; `:705` `var equipment:Vector.<Item> = new Vector.<Item>(13);`; colour tags at `MCSCharacter.as:524-547` | EXACT. Correction: `npcdata.xml` itself uses **zero** colour-override tags (see NF15) |
| 27 | npcdata/per-enemy-hp | **403** of 495 carry `<hp>`, **92** do not. Every cited line is the right `<hp>`: :3125=1000 (Hiroshi L80) · :4076=800 (Mad Cultist L23) · :3846=600 (Amaya L30) · :3446=200 (Tadao L10) · :1848=100 (Wolf) · :1951=60 (Bear) · :499=30 (Bandit Leader) · :4115=30 (Guardian) · :2689=10 (Training Dummy) | EXACT |
| 28 | npcdata/procgen-town | `XMLNpc.as:403` `initProcGenNPC(nodeid, roomid, index, date, isBountyTarget)`; `:415` `var seed:int = nodeid * date + roomid * (index + 3);`; `:416` `new RNG(seed)`; `:418` `dice = rng.rand(8)`; `:419-442` six archetypes with COMMONER on dice 0∨6 and SAMURAI on 5∨7; name calls at :296/:458/:484/:529. Five bindata name tables confirmed: 94 MaleNames · 95 NobleFamilyNames · 96 SamuraiFamilyNames · 97 FemaleNames · 98 PlaceNames | EXACT |
| 29 | npcdata/random-appearance-weighting | `MCSCharacter.as:574-579` verbatim `processString` (split "," → uniform `Math.random()` pick). The block containing `:155` is npc **6 "Thug", `<lvl>2</lvl>`, ai 1**, hat pool = 5 zeros + 12 hats = 17 entries → **bald 5/17** | EXACT |
| 30 | npcdata/shipped-bugs | `:31` carries `6015.6017`; `grep -c "6015\.6017"` = **355**; `XMLNpc.as:460` `hairlist = [6000,…,6015.6017,6018,6019];` (also :486, :497, :531 — all four confirmed); `:1644` `<hair>6.5006501650265E+47</hair>`; mannequins inside :4368-4430 | HELD. **Mis-cite (minor):** the quote attributes `<name>5001</name> <attack>7076</attack>` to `:4386-4387`; those lines are `<npc>` and `<id>816</id>`. The quoted content is at **:4388 and :4389** |
| 31 | npcdata/shipped-data-defects | `:1644` float-collapsed hair pool; `:4371` npc 815 `<name>5001</name><attack>7092</attack>` with `<hat>7093</hat>` and **no** lvl/hp/defense/ai; `:4389`=7076, `:4408`=7077, `:4425`=7040 — four mannequins; 355× `6015.6017`; `docs/gauntlet/L0/index/npcdata.json` really does report attack `[1.0, 7092.0]` and hair `[0.0, 6.5006501650265e+47]` | **EXACT — the sharpest importer-safety claim in the packet** |
| 32 | npcdata/stance-mastery-rank-10 | skill 1000 appears in **76** npc rows (`:535` + 75 siblings ✓); `skilldata.xml` gives 1000 (:4), 1001 (:83), 1002 (:162) **exactly 10 `<level>` rows each** | EXACT |
| 34 | npcdata/wardrobe-randomiser | `<mcs>` slot rows = **3210**, comma-pools = **741** = **23.1%** — to the decimal; `:506` hat pool = 9 zeros + 11 hats = 20 entries → **45%** bare-headed; `:31` and `:505` are the hair pools | **EXACT to the decimal** |

---

## 2. LENS-2 HUNT — new findings

### The pillarbox origin is CLOSED (closes the half claims 0 and 1 both left open)

Claim 0 honestly says *"a single frame cannot separate a Flash-stage pillarbox from the
recorder's own letterboxing."* It does not need to — the literal is in the decompiled source,
in **both** builds:

```
reference/decompiled/shs3_android_payload/scripts/StatsManager.as:80   public static var stageWidth:int = 800;
reference/decompiled/shs3_android_payload/scripts/StatsManager.as:82   public static var stageHeight:int = 480;
reference/decompiled/shs3_android_payload/scripts/StatsManager.as:96   public static var stageBaseWidth:int = 800;
reference/decompiled/shs3_android_payload/scripts/StatsManager.as:98   public static var stageBaseHeight:int = 480;
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104            public static var stageWidth:int = 800;
```

800 × 480 = **5:3 exactly**, independently in the web payload. The ledger's blocker ①
routes this through *"read `stage.stageWidth` in a build"* and P0 proved no build exists —
**it never needed a build.** A 5:3 stage fitted to 1080 px height is 1800 px wide → 60 px
bars; the frames measure 52-53 px bars / 1814-1816 px picture, i.e. the recording carries a
further ~0.9% horizontal stretch on top of the game's own 5:3 canvas. **The bars are the
game's canvas, not the recorder's window.** Re-base HUD x as `(x − 52) / 1816`, then map onto
an 800-wide stage.

### Kill-XP is HELD (claim 21's lead closes)

```
reference/decompiled/shs3_android_payload/scripts/NPC.as:218        this.xp = this.level * 2 + 20;
reference/decompiled/shs3_android_payload/scripts/NPC.as:252        this.xp = lvl * 2 + 20;
reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:82   xp = lvl * 5 + 45;   // isBoss || isDuelist
reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:88   xp = lvl * 2 + 20;   // otherwise
```
Kill XP = `lvl*2 + 20` for ordinary enemies, `lvl*5 + 45` for bosses and duel opponents.
It was never in `npcdata.xml` because it is computed. L-progression blocker ④ ("full
XP-income model") loses its kill-XP half outright.

### The level ≤10 hard clamp (mechanises claim 24)

```
NPC.as:241-245   var factor:Number = lvl / this.level;  if(lvl <= 20) { factor *= 0.9; }
NPC.as:247-249   this.damage *= factor; this.defense *= factor; maxhp *= factor;
NPC.as:253-259   if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); }
EnemyPlayer.as:138-142  if(lvl <= 5) { minDamage = 1; defense = 1; }
```
Whenever a spawn passes an explicit level (`NPCManager.createEnemy/createFriend/
createNeutral/createObjective`, `lvl != 0`), every enemy at level ≤10 is forced to
**1 HP / 1 damage / 1 defense** regardless of what npcdata authored, and levels 11-20 are
damped by ×0.9. That is the mechanism behind the "~1-HP-chip field trash" the video shows.

### Enemy movesets for the EnemyPlayer classes are GENERATED, not read

`EnemyPlayer.as:157-250+` `generateSkillList()` wipes `skillList` (`:159`) and rebuilds it
from a **date-seeded** RNG:
```
:160  var rng:RNG = new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() + StageManager.getCurrentRoom() * 3);
:161  if(level >= 6)  { if(rng.rand(2) == 0) skillList.push(new IntStat(1014,1)); }   // Light Stance Launch
:168  if(level >= 20) { … 1015 }   // Air Combo
:175  if(level >= 12) { … 1036 }   // Deflect (Light)
:182  if(level >= 70) { … 1039 }   // Shunpo
:189/196/203/210     6→1016 Flip-up · 20→1017 Balanced Launch · 12→1037 Deflect · 70→1040 Thousand Stabs
:217/224/231/238     6→1018 Stab · 20→1019 Heavy Launch · 12→1038 Deflect · 70→1041 Deadly Cleave
:245  if(level >= 10) { if(rng.rand(3) == 0) skillList.push(new IntStat(1005,3)); }
```
This is a complete **level-gated enemy skill-unlock ladder** at 50% (1/3 for 1005) per skill,
rolled off the same `node × serverDate + room × k` seed shape as procgen town. It applies to
ai 0/9/14 — **88 of the 425 ai-bearing rows, including all 73 that carry the "standard elite
kit"**. So claim 12's "per-NPC, per-rank data table" is the authored input for the other
337 rows, but for the EnemyPlayer actors the runtime moveset is regenerated in code.
Absent from all 12 ledger systems.

### Enemy melee AI geometry is readable (claims 3 and 22 correctly localised it — here it is)

`reference/decompiled/shs3_android_payload/scripts/EnemyKnife.as`:
```
:140  walkSpeed = Math.random() * 2 + 4;                          // approach speed ∈ [4,6) px/frame
:181  if(mcs.x - playerX < 50 && mcs.y - playerY < 50)            // attack trigger, facing left
:200  if(playerX - mcs.x < 50 && mcs.y - playerY < 50)            // attack trigger, facing right
:113-115 if(target.isDowned()) target.checkHitObject(…, new Damage(damage * 2, level));   // 2× on downed
:104/:108  movePositionX(∓100)   // knockdown recovery push
:64/:68    movePositionX(∓40)    // getup-front push
:127  target = NPCManager.getNearestEnemy(getMapPosition(), true);
```
`NPC.as:285-294` `checkAITrigger()` = a countdown on `aiCounter`/`aiCounterMax`;
`EnemyPlayer.as:52` sets `aiCounterMax = 12` → **retarget every 12 frames**.
Targeting is nearest-enemy, no coordination. That is the aggro model (blocker ④) and the
active-frame trigger geometry (half of blocker ③) for one class; the other 34 classes follow
the same `startAction/doAction` shape and are equally readable.

### Four-faction spawn model (silence — no claim mentions it)

`NPCManager.as:869-937`: `createEnemy` → `enemyList`; `createFriend` → `friendList` +
`setIsFriendly()`; `createNeutral` → `neutralList`; `createObjective` → `objectiveList`
**and** routed to `enemyList` on `ACTION_FIGHT`/`ACTION_ASSASSINATE` or to `friendList` on
`ACTION_ESCORT` (`:923-930`). Four lists, not two, with objective NPCs changing faction by
quest action type. Also `NPCManager.as:939` `createNetworkPlayer(...)` — a whole
network-player spawn path.

### Allies scale to the PLAYER's level (silence)

`FriendlyElite.as:70`, `FriendlyArcher.as:58`, `FriendlySpearElite.as:56` all call
`this.setLevel(StatsManager.getLevel())`. Campaign allies are not authored at a fixed level —
they track the player.

### ai 0 — the DUEL opponent — has ZERO npcdata rows (silence)

Unused ai values in 0..37 are `{0, 10, 15, 16}`. Claim 3 scopes itself to "1–37" and claim 4
lists only "10/15/16", so **ai 0 is silently dropped by both**. ai 0 is
`new EnemyPlayer(MCSPool.getMCS(), true, false)` — `isDuelist = true`, i.e. **the duel
opponent of the game this repo is recreating.** It is not an npcdata row at all: it is built
by `XMLNpc.initDuelist()` from an equipment string + a stats string
(`XMLNpc.as:346-365`, `DEFAULT_EQSTRING` at `:36`, `parseEquipmentString` at `:703-712`),
which is exactly why claim 8's damage math lives on that path. **The entire Duels roster is
outside npcdata.** For a project named "SSHD 1:1 — Duels", that is the most important
absence in this file.

### Category 11 decoded (corrects claim 5's reasoning)

Category 11 has **seven** members, not two:
`1064 Back Throw · 1065 Air Stab · 1066 Bull Charge · 1067 Punch Lunge · 1068 Undying ·
1500 (unnamed) · 1501 (unnamed)` — all with no `<req>`, no `<desc>`, one `<level>` row
(1068 has zero). So "category 11 ⇒ stance mastery" does not follow: it is the enemy-only
special-move bucket. The three stance masteries are 1000/1001/1002 in categories **1/2/3**.
**However**, the surveyor's conclusion is still well-supported by different evidence I found:
1500/1501 occupy the *first, mastery-shaped slot at `<lvl>3</lvl>`* in exactly the loadouts
where 1000/1001/1002@3 sit for everyone else — `npcdata.xml:3662` (Aboshi, 1500@3),
`:3898` (Magoichi, 1500@3), `:3934` (Gojo Takamori, 1501@3) — and the animation sets exist:
`reference/extracted/android/101_MCSCharacter_DualStanceAnimationData.bin` and
`reference/extracted/android/95_MCSCharacter_ReversedStanceAnimationData.bin`
(web equivalents `bindata/104_1t4631s0.bin`, `bindata/110_1t4637s0.bin`).
**Two extra stances — dual-wield and reversed-grip — is the right reading; the category
argument is the wrong reason for it.**

### Five paperdoll-template rows, not one (silence)

Rows with **no `<name>`, no `<ai>`, no `<lvl>`**: ids **0 (:3), 47 (:1511), 160 (:3352),
801 (:4097), 819 (:4437)**. Claim 25 treats npc 0 as "*the* reference paperdoll"; there are
five, spread across the file. A sixth group — ids 815-818 — carries `<name>5001</name>`
which resolves to the literal string **`"?"`**, plus the mis-keyed hat id in `<attack>`
(claim 31). Nine display-only rows in total.

### npcdata never uses a single colour override (silence / corrects claim 26)

`MCSCharacter.as:523-547` parses `armorpcolor/armorscolor/pantspcolor/pantsscolor/
hatpcolor/hatscolor/maskpcolor…`. `npcdata.xml` contains **zero** of them. Enemy clan
identity is carried entirely by distinct armour/hat **item ids** (claim 13), never by tint —
which is a hard from-scratch-art constraint: five factions need five painted garments.

### NPC id-band structure (silence)

`0-99` 91 rows · `100-199` 99 rows · `200-256/300-356/400-456/500-556/600-656` five 57-row
armies (285) · `800-819` 20 rows (named bosses, allies, mannequins). **657-799 is empty.**
No duplicate ids. The 800 band is the campaign-scripted cast: 800 Mad Cultist(ai35),
802 Guardian(ai36), 805 General Daisuke(ai14), 806/807 allied Soldiers, 809 Mitsuo,
810 Magoichi, 811 Chikako, 812 Scout, 813 Aboshi.

### String-table band partition (an enum nobody decoded)

`docs/gauntlet/L0/index/strings.json` resource ids are partitioned by consumer:
**4000s** = item names (`itemdata.xml` `<name>4000</name>` → "Small Soldier Pill") ·
**5000s** = NPC names (`npcdata.xml` `<name>`; 5001 = "?", 5009 = "Ruffian", 5053 = "Soldier",
5063 = "Castle Guard") · **6000s** = skill display names **and** skill descriptions
(1000→`<displayname>6000</displayname>` "Light Stance Mastery", `<desc>6001</desc>`) ·
**7000s** = per-level skill descriptions (`<level><desc>7000</desc>`). Knowing the band tells
you which file a numeric id belongs to before you look it up.

---

## 3. STANDING-INVARIANT NOTE

No measurement doc contradicted a frame in this packet, so the FRAME-WINS rule was not
invoked against a doc. It **was** invoked in the other direction and I say so out loud:
claims 0 and 1 correctly put the frame above any doc assuming a 1920-wide 16:9 canvas, and
the decompiled `stageWidth = 800 / stageHeight = 480` literal now agrees with the frame
rather than overruling it — the frame said "not 16:9", the source says "5:3", same answer.
