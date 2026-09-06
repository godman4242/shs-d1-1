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
   belongs. **356 occurrences** across `npcdata.xml`. Preserve it in an
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
- **L4a-E** `OG_NPC_SOURCE_ANOMALIES` holds the `6015.6017` case, cited to **both**
  `npcdata.xml` and `XMLNpc.as:460`; nothing coerced. The **6 unresolved `<name>` ids** are
  explicit rows, not empty strings.
- **L4a-F** the `<mcs>` comma lists kept VERBATIM as lists (never collapsed to one id),
  with `MCSCharacter.as:573-578`'s pick-one-at-random rule carried in the file header.
- **L4a-G** `npm run typecheck` 0 · `npm run lint` 0 · `npx vitest run` green, pasted.
- **L4a-H** `RESUME_HERE.md`, `docs/sessions/-SESSION-LOG.md`, `docs/DIVERGENCES.md` and
  `GAUNTLET.md` §2's L4 row updated **in the same commit as the change**.

**Never soften a gate to fit a result — re-author, or take a ruling.**

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
git log -1 --oneline          # a68bf51 LANE L3B: the branch rides above the sash…
npx vitest run                # Test Files 68 passed (68) · Tests 1073 passed (1073)
```
Confirm it against a real run, not against this document. §5's own named failure mode is a
kickoff that predicts a baseline instead of measuring it.

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
  git log -1 --oneline   ->  a68bf51
  npx vitest run         ->  68 files / 1073 tests

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

FIRST, DO THIS: confirm the baseline, dump npcdata.xml's tag vocabulary and its
path-qualified positions, and tell me in your own words what the schema is and which
of the ten traps you can already see in the dump. Don't write code until I ok it.
```
