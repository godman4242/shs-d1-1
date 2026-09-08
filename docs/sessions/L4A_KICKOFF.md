# LANE L4a KICKOFF — THE ENEMY ROSTER AND THE AI DISPATCH TABLE

**Written 2026-09-06 at `a68bf51`. Model: Opus 5 @ `xhigh`. Scale: NO fan-out — a
generator script plus a byte-check, per `GAUNTLET.md` §2's "a script beats a swarm".**

Paste the `text` block below as the first message of a fresh session.

---

## Why this lane, and why now

The owner's call, 2026-09-06: *"nevermind the game logic is wht is imoprtant for now"*.
L3B (the fighter's art) is parked with its remaining work named and blocked; this is the
next lane on `GAUNTLET.md` §2's own ordering rule (**L3 → L4 → L1**, cheapest-first,
because L4's rows are already held and its gate is a byte-check rather than a judgement
call).

**It is also the largest unread thing in the repo.** Verified first-hand on 2026-09-06:

```
reference/extracted/npcdata.xml    228,413 bytes   495 <npc> rows
   <mcs> 495 · <id> 495 · <name> 490 · <ai> 425 · <lvl> 414 · <attack> 406
   <hp> 403 · <defense> 394 · <hat> 287 · <prop1> 217 · <skills> 96 · <reward> 66

$ grep -rn "npcdata\|ogNpc\|OG_NPC" src/
   (nothing — never mined)
```

Meanwhile `src/config/ai.ts` ships **three hand-authored tiers** (`easy` / `normal` /
`hard`) while `NPCManager.as:516` carries a **38-case `switch(xml.ai)`** naming a distinct
actor class for every value. That is the same shape L2 found (three skills with two
guessed cooldowns, beside 75 skills × 182 exact rows) and L3 found after it.

---

## THE TASK, in one line

**Transcribe all 495 NPC rows into `src/config/ogNpcs.ts`, byte-checked against an
independent parser, and transcribe `NPCManager.as`'s 38-case AI dispatch into
`src/config/ogAi.ts` as CONTRACT.**

### In scope
1. `scripts/payload/transcribeNpcs.py` → `src/config/ogNpcs.ts`, verbatim.
2. `tests/ogNpcData.test.ts` — byte-check with a **second, independent** parser, the way
   `tests/ogItemData.test.ts` and `tests/ogSkillData.test.ts` do it.
3. `scripts/payload/transcribeAi.py` → `src/config/ogAi.ts`, the 38 `ai` → actor-class
   rows, each cited to its `NPCManager.as` line.
4. **Carry the `<mcs>` comma-list ruling into the transcriber.** ⭐ It was SETTLED while
   this kickoff was being written, so do not re-derive it — `MCSCharacter.as:573-578`:
   ```
   internal function processString(xmlstring:String) : int {
      var selectArray:Array = new Array();
      selectArray = xmlstring.split(",");
      return selectArray[int(Math.random() * selectArray.length)];
   }
   ```
   **A uniform random pick, once, at spawn.** `XMLNpc.as:561` does the same for its
   generated `hairlist`. `GAUNTLET.md` §2.2's *"a hypothesis, not a finding"* is corrected
   in the same commit as this file. ⚠️ Note which randomness: `processString` uses
   **`Math.random()`** while `XMLNpc.as:561` uses the **seeded `rng.rand()`** — two
   different sources for the same kind of choice, which matters the day paperdolls have to
   be reproducible. The transcriber's job is to keep the list VERBATIM, as a list.
5. A DIVERGENCES entry recording what `AI_TIERS` actually is now that the real table
   exists, and which of the 38 (if any) it stands in for.

### ⛔ NOT in scope — say so at the gate rather than discovering it there
- **Building the 34 enemy behaviours.** That is L4b, it is from-scratch subsystem
  construction, and §2 routes it to **Fable 5 @ `high`**.
- **Wiring real NPCs into the duel or the encounter.** That moves `Sim.ts` and
  `tests/duel-baseline.test.ts`, which are §4's no-touch list and **only L5 may touch
  them**, by its own atomic protocol.
- **The fight-feel grade.** It needs A1 frame cites and the owner's LOOK.

---

## ⚠️ ELEVEN TRAPS, ALL VERIFIED FIRST-HAND ON 2026-09-06

Every one of these will silently produce a plausible wrong answer.

1. **`<lvl>` IS AT TWO DEPTHS.** 1,049 in the file: **402** are the NPC's own level and
   **647** are inside `<skills><skill><lvl>`. A depth-blind regex reads a skill's level as
   the enemy's. And **414 rows *contain* `<lvl>` while only 402 own one** — so 12 rows have
   a skill level and no NPC level. Pin that 402/647/414 split in the test.

2. **`ai` DEFAULTS TO 1, NOT TO "ABSENT".** `XMLNpc.as:135-141`:
   `if(xml.ai.toString() != "") { this.ai = xml.ai; } else { this.ai = 1; }`.
   The 70 rows with no `<ai>` are **EnemyKnife**, not "no AI". Emitting `undefined` there
   would be a lie the renderer cannot tell from missing data.

3. **`6015.6017` — A PERIOD WHERE A COMMA BELONGS — IS IN THE SHIPPED GAME'S OWN CODE.**
   Not just the XML: `XMLNpc.as:460` literally reads
   `hairlist = [6000,...,6014,6015.6017,6018,6019]`. In ActionScript that is a valid
   `Number`, so the array silently has **one fewer element** and a float where an int
   belongs. **355 occurrences** across `npcdata.xml` — *not* 356; the 356th
   dot-bearing `<hair>` value is a SECOND, DIFFERENT anomaly, `6.5006501650265E+47`
   on npc 55 (measured 2026-09-07, see the RECON section). Preserve BOTH in an
   `OG_NPC_SOURCE_ANOMALIES` export exactly as L3 preserved `baseprice: '.'` on item
   11037. **Never coerce it, never "fix" it, never `float()` a list.**

4. **92 OF 495 ROWS HAVE NO `<hp>`** (ids 0, 47, 50–55, 100, 103–105, …). They are
   non-combat NPCs. Absent is not zero.

5. **`scalex` / `scaley` ARE FLOATS**, on 16 rows: `0.95, 0.99, 1, 1.1, 1.3, 2`. There is a
   **2× giant**. An `int()` in the transcriber destroys the roster's only size variation.

6. **`<mcs>` SLOT VALUES ARE COMMA-SEPARATED LISTS** on **741 of 3,210** slots (hair 355,
   weapon 176, mask 72, hat 43, armor 39, pants 30, shoes 15, head 11), and **`0` means
   empty**. Keep them as LISTS — collapsing one to a single id at transcribe time bakes in
   one roll of a die the game re-rolls at every spawn (scope item 4 has the source).

7. **THE XML's `ai` IS NOT ALWAYS FINAL.** `XMLNpc.as:479` and `:523` assign
   `this.ai = 32` and `this.ai = 33` in code, after the XML is read. Transcribe the XML
   verbatim and record the code override as a separate, cited fact.

8. **`<earth>` ON 3 ROWS AND `<fire>` ON 1**, both value `10`. Tiny, real, and the elements
   belong to L11 — record, do not build.

9. **`<name>` IS A STRING-TABLE ID, NOT A NAME.** Row 16's `<name>` is `5011`. The lookup
   is `docs/gauntlet/L0/index/resolved_names.json` (§2.1), and it resolves **484 of 490 —
   6 MISS, and all six are the SAME id `5017`, on rows 50-55** (six of the 92 rows that
   also carry no `<hp>`). One unresolved string, not six broken lookups. Emit the raw id
   AND the resolved string, and make those rows explicit
   rather than empty strings: "unnamed" and "name we could not resolve" are different
   facts, and L3 already proved that confusing them costs a session (its 178 unnamed items
   turned out to be base body art, not a lookup failure).

10. **THE ANDROID CAVEAT (C2) STILL BINDS.** All four data XMLs are the **Android** build:
   the web payload carries zero `<npcdata>` root. Every row is **v0.682** until a web-side
   artifact says otherwise. Carry that on the generated header, as `ogItems.ts` does.

11. **`enemyModel.ts` ALREADY HOLDS THE COMBAT MODEL, AND IT IS CONTRACT.** A named
    duellist's HP and damage are **recomputed at spawn from the PLAYER's stats** so a fight
    lasts K hits (`enemyHP = max(scaledBaseHP, effPlayerDmg × K)`, `K = max(10+Δ, 3)`).
    So `<hp>` / `<attack>` / `<defense>` are **base** values that model consumes — porting
    them is **not** a licence to start using the raw `<hp>`. Do not touch `enemyModel.ts`.

---

## ⭐ SESSION 31 RECON — MEASURED AND BANKED 2026-09-07. **DO NOT RE-DERIVE THIS.**

The vocabulary dump the closing instruction asked for was run and is recorded here.
**Ten of the eleven traps above reproduced exactly; trap 3's count is wrong, and nine
more shapes the eleven do not cover were found.** Every number below came out of a
probe against `reference/extracted/npcdata.xml`
(sha256 `e9835f3be51e5f91227b425bf654cc71a85cf3310ba026f018cc19d9eb930126`, 228,413 B),
not out of a document.

### The grammar, closed

**32 tag names · 35 path-qualified positions · 29 leaf positions · nesting 4 deep**
(itemdata went 3) · **zero attributes** · zero non-ASCII · zero comments/CDATA/PI ·
**9,621 CRLF _and 4 bare LF_** · **5 empty leaves** (itemdata had zero).

```
<npcdata>                             1
 <npc>                              495   ids 0..819 — distinct, NOT sorted, NOT contiguous
  <id>                              495
  <name>                            490   string-table id 5000..5122 (5 rows carry none)
  <lvl>                             402   1..80          <- the NPC's own
  <hp>                              403   1..1000        (92 absent)
  <ai>                              425   1..37          (70 absent -> means 1, not "none")
  <attack>                          406   1..7092
  <defense>                         394   0..200
  <scalex> <scaley>             16 / 16   FLOAT 0.95 · 0.99 · 1 · 1.1 · 1.3 · 2
  <earth> <fire>                  3 / 1   both value 10
  <mcs>                             495   the paperdoll — 5 of them EMPTY
    armor gloves hair hat head mask neck pants prop1 prop2 shoes weapon
                                  3,210 slot values · 741 comma-lists · 193 exactly "0"
  <skills>                           96
    <skill>                         647
      <id>                          647   1000..1501  (all 39 distinct resolve in ogSkills.ts)
      <lvl>                         647   1..10       <- NOT the NPC's
  <reward>                           66
    <loot>                          131
      <id>                          131   0..3 = SENTINEL, else an item id
      <qty>                         131   1..5
      <chance>                      131   FLOAT — 119 of 131
```

### ⛔ TRAP 3's COUNT IS WRONG, and the error is a second anomaly hiding inside it

```
$ grep -o "6015\.6017" reference/extracted/npcdata.xml | wc -l
     355
```
Trap 3 says **356**. There are 356 `<hair>` values containing a period because the
356th is a **different value**: `<hair>6.5006501650265E+47</hair>` on **npc id 55**.
Whoever measured 356 counted dot-bearing hair values and folded a separate anomaly
into the first one's count. `OG_NPC_SOURCE_ANOMALIES` must hold **two** entries.

### NINE SHAPES THE ELEVEN TRAPS DO NOT COVER

1. **A SECOND SOURCE ANOMALY** — `6.5006501650265E+47`, `<hair>`, npc 55 (also one of
   the six unresolved `5017` names and one of the 92 with no `<hp>` — the same broken row).
2. **`<chance>` IS A FLOAT: 119 of 131.** `0.05 · 0.1 · 0.3 · 0.4 · 0.5 · 1`. Trap 5 names
   only scalex/scaley. `XMLLoot.as` declares `public var chance:Number` and defaults it
   to `1` when absent. An `int()` here zeroes 119 of 131 drop rates.
3. **`<id>` IS AT THREE DEPTHS, not two** — `npc/id` 495 · `reward/loot/id` 131 ·
   `skills/skill/id` 647. It is the primary key. The independent raw-regex parser must
   strip **both** `<skills>` and `<reward>` before any scalar read, the way
   `ogItemData.test.ts` strips `<modifier>` once.
4. **5 EMPTY LEAVES, all `<mcs></mcs>`** — npc ids **64, 158, 192, 193, 194**.
   `transcribeItems.py`'s `text()` **deliberately dies** on an empty tag. Copying that
   rule verbatim kills the run on legitimate data. *Present-but-empty ≠ absent*: all 495
   rows have `<mcs>`; 5 are empty paperdolls.
5. **IDS ARE NEITHER CONTIGUOUS NOR SORTED** — 495 distinct spanning 0..819. Index ≠ id.
   Pair committed row *i* with source block *i*.
   ⛔ **THIS SHAPE'S ILLUSTRATION WAS WRONG AND IS CORRECTED (2026-09-08, the source
   wins).** It read *"807 sits between 197 and 201"*. Measured: there is exactly **ONE**
   descent in the sequence, at source index 209→210, where the block **800..819** is
   spliced between id **199** and id **200** — `…817, 818, 819, 200, 201, 202…`. The claim
   is unchanged and correct; only the example was. Pinned with the real neighbours in
   `tests/ogNpcData.test.ts`.
6. **TWO SERIALISATION STYLES IN ONE FILE** — `<mcs>` is pretty-printed CRLF+tabs;
   `<skills>` blocks are written **inline on one line**, and all 4 bare LFs live inside
   them. A block regex tuned on itemdata's uniform CRLF mis-slices.
7. **THE `<mcs>` LISTS ARE WEIGHTED POOLS, NOT SETS.** 28 of the 741 repeat an element.
   Npc 55's hat list is `0,0,0,0,0,0,0,0,0,0,0,7003,7008,…` — **eleven zeros of 22
   entries**, i.e. "no hat" is exactly 50%. `processString` picks uniformly *by index*
   (`MCSCharacter.as:574-579`), so de-duplicating changes the odds. Keep duplicates AND order.
8. **THERE ARE THREE `ai` DISPATCHES, NOT ONE.** The 38-case switch is `createNPC`
   (`NPCManager.as:516`, cases 518-630, `default:` at 632 → `trace()` and `actor` stays
   **null**). But `createRoomNPC` (`NPCManager.as:671`) is a **different** if/else chain
   over the same values → `RoomGoblin` / `RoomOgre` / `RoomZombie` instead of
   `EnemyGoblin`/`EnemyOgre`/`EnemyZombie`, all carrying `doChase`, and it **merges ai 11
   and 16** into one `EnemyWolfAlpha` branch. `createRoomNPCProcGen` (`NPCManager.as:749`)
   is a third: 32 → `EnemyCivilianOld`, 33 → `EnemyCivilianFemale`, else `EnemyCivilian`.
   Transcribing only the switch records **one third of the map**.
   ⭐ **AND THERE IS A FOURTH `ai` SITE THAT IS NOT A DISPATCH AT ALL (found 2026-09-08 by
   a pin that failed).** `NPCManager.as` carries **16** `xml.ai == N` comparisons, not 15:
   `:643`, inside `createNPC` and *after* the switch, conditions the duellist's **spawn
   placement** on `ai == 0` — x **650** facing left when `xml.rightPos`, x **150** facing
   right otherwise, then `startAnim(MCSActor.BOW2)`, the opening bow. Committed as
   `OG_AI_DUEL_PLACEMENT`; **recorded, not wired** — those coordinates move `Sim.ts`, so
   they are L5's.
   ⚠️ Trap 7 names `XMLNpc.as:479` (=32) and `:523` (=33). There are **two more**:
   `:315` (`this.ai = 0`, the duellist) and `:586` (`this.ai = bossxml.ai`, the bounty
   target inheriting NPC 18).
9. **"34" IS TWO DIFFERENT 34s.** The data uses **34 distinct `<ai>` values**, and cases
   **0, 10, 15, 16 never appear** in `npcdata.xml`. Separately there are **34 `Enemy*.as`**
   classes on disk (plus 3 `Friendly*` and 3 `Room*` — `RoomGenNode.as` is not an actor).
   Same number, different sets — the coincidence-trap shape `transcribeItems.py` already
   pins as disjoint (its 93s, its 178s). **Pin them disjoint** or a future reader
   "verifies" one with the other.

### TWO RULINGS SETTLED FIRST-HAND — do not re-open

- **Loot ids 0–3 are a SENTINEL space, not item ids** (`NPC.as:837-855`, read directly):
  `0` → 1 coin ×qty · `1` → 5 coins ×qty · `2` → the quest loot item · `3` → a random item
  at the NPC's level · **else** → `addLootItemBasic(lootType, qty)`, the item id. That is
  why `0,1,2,3` do not resolve against `OG_ITEMS` while `2112/2113/2114/20028` do.
  `XMLLoot.as` even types `id` as **String**.
- **GAUNTLET §2.2's closing colour-override warning DOES NOT APPLY to this file.** It says
  `<mcs>` carries `<armorpcolor>`/`<armorscolor>` "that L4's transcriber must not drop".
  `grep -c color npcdata.xml` → **0**. Those tags are emitted by `XMLNpc.as:367-374` into
  the XML the game *generates* for a player/procgen NPC. **Nothing to drop.** §2.2 is
  corrected in the same commit as this section.

### One open item, deliberately not guessed

`<prop1>` is `1` or `2` on ~50 rows, and `<armor>/<head>/<pants>` are `2` on npc 78 and
`10` on npc 75 — **none are item ids** (checked against the committed 982 `OG_ITEMS`
top-level rows). `MCSCharacter.as:1229-1249` shows `setProp` falls back to `prop13000`
(the default scabbard art) when an id has no symbol, so it degrades gracefully rather
than crashing. **Ruling: record them verbatim as a cited fact, attach no meaning.**

---

## THE AI TABLE IS ALREADY LEGIBLE — this is not research, it is transcription

`NPCManager.as:516-635`, read first-hand:

```
 0 EnemyPlayer(mcs,true,false)   10 EnemyWolf2            20 EnemyVegePatch       30 FriendlyElite
 1 EnemyKnife                    11 EnemyWolfAlpha        21 EnemyStag            31 FriendlySpearElite
 2 EnemyArcher                   12 EnemyHorse            22 EnemyGoblin          32 EnemyCivilianOld
 3 EnemyKatana                   13 EnemyTrainingDummy    23 EnemyOgre            33 EnemyCivilianFemale
 4 EnemySpear                    14 EnemyPlayer(f,true)   24 EnemyFox             34 FriendlyArcher
 5 EnemyShield                   15 EnemyPlayerGiant      25 EnemyGoblinThrower   35 EnemySorcererBoss
 6 EnemyNinja                    16 EnemyNianMonster      26 EnemyZombie          36 EnemyKanjiGuardian
 7 EnemyCivilian                 17 EnemyBear             27 EnemyJiangSi         37 EnemySpearElite(t)
 8 EnemyWolf                     18 EnemyBoar             28 EnemySpearElite(f)   default: trace(error)
 9 EnemyPlayer(mcs,false,false)  19 EnemyDeer             29 EnemyElite
```

**34 `Enemy*.as` and 3 `Friendly*.as` classes are on disk**, and every class the switch
names was spot-checked present (`EnemyPlayerGiant`, `EnemyNianMonster`, `EnemySorcererBoss`,
`EnemyKanjiGuardian`, `FriendlySpearElite`). `EnemyKatana.as` alone is 220 lines of real
behaviour, so L4b has its source when it comes.

⚠️ **`EnemyPlayer` appears at ai 0, 9 and 14 with different constructor flags, and
`EnemySpearElite` at 28 and 37.** The behaviour is the flag, not just the class — capture
the arguments, not only the name, or three distinct enemies collapse into one row.

---

## THE GATE — binary, every item green with pasted output, or the lane is open

- **L4a-A** 495 rows byte-exact against an **independent** second parser, and the file's
  own row/tag counts reproduced (495 / 490 / 425 / 414 / 406 / 403 / 394 / 96 / 66).
- **L4a-B** the tag vocabulary is asserted **CLOSED** — the generator **dies** on an unknown
  tag, chaos-planted and watched red. (This is the check that saved L2: the `<req>`
  prerequisite tree would have shipped as "present but empty" on all 52 rows.)
- **L4a-C** the `<lvl>` depth split pinned at **402 / 647**, and the `ai`-defaults-to-1 rule
  applied to all **70** rows that lack it.
- **L4a-D** all **38** `ai` cases present in `ogAi.ts`, each carrying its `NPCManager.as`
  line, with the constructor flags captured for 0/9/14 and 28/37.
- **L4a-E** `OG_NPC_SOURCE_ANOMALIES` holds **BOTH** anomalies — `6015.6017` (355x,
  cited to `npcdata.xml` AND `XMLNpc.as:460`) and `6.5006501650265E+47` (npc 55); nothing
  coerced. The **6 unresolved `<name>` ids** are explicit rows, not empty strings, and are
  kept distinct from the **5 rows carrying no `<name>` tag at all** (ids 0, 47, 160, 801, 819).
- **L4a-I** the RECON section's nine shapes are each pinned: the 5 empty `<mcs>` rows survive
  transcription, `<chance>` stays FLOAT on all 119, ids are matched BY SOURCE ORDER (not id),
  `<mcs>` lists keep duplicates and order, and the two 34s are asserted **disjoint**.
- **L4a-J** `ogAi.ts` carries **all three** dispatches — `createNPC` (38 cases),
  `createRoomNPC` (`NPCManager.as:671`) and `createRoomNPCProcGen` (`:749`) — plus the four
  code-side `ai` assignments (`XMLNpc.as:315/479/523/586`) and the `default:` behaviour.
- **L4a-F** the `<mcs>` comma lists kept VERBATIM as lists (never collapsed to one id),
  with `MCSCharacter.as:573-578`'s pick-one-at-random rule carried in the file header.
- **L4a-G** `npm run typecheck` 0 · `npm run lint` 0 · `npx vitest run` green, pasted.
- **L4a-H** `RESUME_HERE.md`, `docs/sessions/-SESSION-LOG.md`, `docs/DIVERGENCES.md` and
  `GAUNTLET.md` §2's L4 row updated **in the same commit as the change**.

**Never soften a gate to fit a result — re-author, or take a ruling.**

---

## ✅ THE GATE IS MET — LANE L4a CLOSED 2026-09-08 (commit: this one)

| Gate | Verdict | Evidence |
|---|---|---|
| **L4a-A** | ✅ | 495 rows byte-exact vs an independent raw-regex parser; source counts reproduced 495 / 490 / 425 / 414 / 406 / 403 / 394 / 96 / 66 |
| **L4a-B** | ✅ | vocabulary CLOSED at 32 tags; generator chaos-planted **5/5 red** (unknown tag · attribute · empty non-`<mcs>` leaf · duplicate id · `<ai>` outside 0..37), control green |
| **L4a-C** | ✅ | `<lvl>` split pinned 402 / 647 (+ the 414 depth-blind count and the 12 rows that explain it); `ai`-defaults-to-1 applied to all **70** silent rows as `aiEffective`, with `ai` still absent where the source is |
| **L4a-D** | ✅ | all **38** `createNPC` cases, each with its `NPCManager.as` line AND its constructor args; 0/9/14 and 28/37 pinned distinct |
| **L4a-E** | ✅ | `OG_NPC_SOURCE_ANOMALIES` = 356 rows over **2** distinct values (`6015.6017` ×355, `6.5006501650265E+47` ×1 on npc 55), nothing coerced; the **6** unresolved `5017` rows (ids 50-55) kept distinct from the **5** rows with no `<name>` tag (0, 47, 160, 801, 819) |
| **L4a-I** | ✅ | 5 empty `<mcs>` survive · `<chance>` FLOAT on all 119 · matched BY SOURCE ORDER · pools keep duplicates and order (28 repeats; npc 55's hat = 11 zeros of 22) · the two 34s asserted **disjoint** |
| **L4a-J** | ✅ | all three dispatches (38 + 13 + 2) **plus a fourth `ai` site the RECON did not have**, the four `XMLNpc.as` overrides, `isAnimal()`, and both `default:` behaviours incl. `createNPC`'s null |
| **L4a-F** | ✅ | `<mcs>` kept VERBATIM as strings, never collapsed; `processString`'s pick-one rule carried in the generated header |
| **L4a-G** | ✅ | typecheck 0 · lint 0 · **70 files / 1113 tests** (was 68 / 1073) |
| **L4a-H** | ✅ | `RESUME_HERE.md`, `-SESSION-LOG.md`, `DIVERGENCES.md` and §2's L4 row all updated in this commit |

**No gate was softened.** Two pins the author wrote were *wrong and the tests caught them* —
the id-ordering example and a claimed-disjoint overlap — and both were re-authored to the
measured fact rather than relaxed.

---

## DON'T BREAK

- **§4's no-touch list.** `Sim.ts` and `tests/duel-baseline.test.ts` move only in L5.
- **The floors**, raised twice this session: tracing **≥ 0.9179** · held-out **≥ 0.8654** ·
  height **≤ 138.3**. They go UP or they stay. This lane should not touch them at all — if
  it does, something is wrong with the change, not with the floor.
- **GATE A13-A's ratchet** (`tests/a13Bands.test.ts`): worst cell ≤ **12.78 pp**, and its
  eight named open cells may only shrink.
- `src/core/` zero numeric literals · dependency direction · render-only scenes.
- `src/config/ogItems.ts`, `ogSkills.ts`, `ogCompositing.ts` and their transcribers are
  **CLOSED evidence**. Re-run a transcriber; never hand-edit its output.

## THE BASELINE TO CONFIRM FIRST

```bash
git log -1 --oneline          # 863f9e4 docs: park the art lane, kick off L4a…
npx vitest run                # Test Files 68 passed (68) · Tests 1073 passed (1073)
```
Confirm it against a real run, not against this document. §5's own named failure mode is a
kickoff that predicts a baseline instead of measuring it.

**The commit hash goes stale the moment anything else lands; the TEST COUNT is the
baseline that actually binds.** This document was written at `a68bf51` and then committed
as `863f9e4`, so its own first draft named a hash that was already one behind by the time
anyone could paste it — measured and corrected 2026-09-07.

---

## THE PASTE-READY PROMPT

```text
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

LANE L4a — THE ENEMY ROSTER AND THE AI DISPATCH TABLE. Opus 5 @ xhigh, NO fan-out:
this is a deterministic transform, so it gets a generator plus a byte-check, never a
swarm (GAUNTLET.md §2, "a script beats a swarm").

READ FIRST, then tell me your plan before you write anything:
- docs/sessions/L4A_KICKOFF.md   <- the whole lane: traps, gate, scope, cites
- RESUME_HERE.md                 <- top block is SESSION 30; L3B parked, art blocked
- docs/GAUNTLET.md               <- §0 the law (A1..A5), §2 the lane board, §4 no-touch
- scripts/payload/transcribeItems.py + tests/ogItemData.test.ts  <- the shape to copy

CONFIRM THE BASELINE FIRST, with a real run and not a prediction:
  git log -1 --oneline   ->  863f9e4  (the commit that added this kickoff)
  npx vitest run         ->  68 files / 1073 tests
If HEAD has moved past 863f9e4, say so and tell me what landed since — do not
assume it is harmless. The test count is the baseline that actually matters.

THE TASK. reference/extracted/npcdata.xml holds 495 NPCs — full paperdoll, <lvl>, 425
<ai>, 647 <skill>, 66 loot tables — and grep finds ZERO references to it in src/.
Meanwhile src/config/ai.ts ships THREE hand-authored tiers while NPCManager.as:516
carries a 38-case switch(xml.ai) naming a distinct actor class for every value.
Transcribe both, byte-check both.

⚠️ ELEVEN TRAPS ARE ALREADY MEASURED AND WRITTEN DOWN IN THE KICKOFF. Read them before
you write a line — L2 and L3 both had a trap that would have shipped silently, and
both were caught by dumping the vocabulary first. The two that will bite hardest:
  - <lvl> is at TWO depths (402 the NPC's own, 647 inside <skills><skill>);
  - `6015.6017` — a period where a comma belongs — is in the SHIPPED GAME'S OWN AS3
    (XMLNpc.as:460), so it is an anomaly to preserve, never to coerce.

⛔ NOT IN SCOPE, and say so up front rather than at the gate: building the 34 enemy
behaviours (that is L4b, and §2 routes it to Fable), wiring NPCs into the duel (that
moves Sim.ts and the duel baseline — L5 only), and the fight-feel grade.

DONE = the kickoff's gate L4a-A..H, every item green with PASTED output.
Never soften a gate to fit a result — re-author, or come to me for a ruling.

FIRST, DO THIS: confirm the baseline, then read the RECON section — the vocabulary
dump, the corrected trap-3 count, the nine extra shapes and the two settled rulings are
ALREADY MEASURED AND BANKED there (2026-09-07). Do NOT re-derive them. Spot-check three
of its numbers against the file with your own command, say which three and paste the
output, then go straight to writing transcribeNpcs.py. No further design turn is needed.
```
