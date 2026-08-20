# CRITIC — CITE LENS — unit `src-string-table`

**Reviewer stance:** blind. I did not see the surveyor's reasoning. I re-decoded
`reference/extracted/android/118_Mobile_Lang_EN.bin` myself (UTF-16LE → UTF-8, 7,675 lines,
2,555 `<trans-unit>` records, id attrs 0…2554 contiguous, 2,554 unique resnames), re-parsed
`114_Mobile_AchievementData.bin` (UTF-8, 554 lines, 61 `<achievement>`), and cropped three
1080p frames. Every line number the survey printed was opened.

---

## HEADLINE

**The cites are immaculate. The novelty check is not.**

All 15 cited claims resolve **exactly** — every line number, every resname, every quoted
string, verbatim, first try. That is the best cite hygiene I have seen in this lane and I
found **zero** broken or fabricated citations.

But **six of the fifteen re-derive work four earlier runs already banked**, and the survey's
own coverage greps did not catch them because they were **case-sensitive multi-word phrase
greps**. `"Control Point"` misses `HEX_CONTROLPOINT`. `"Achievement62"` misses
`meta-social.md`'s 61-row achievement table. Nothing in the grep set would ever have found
`items-equipment/carry-weight-string-corroboration`, which quotes the survey's ST-12 string
**verbatim** and reaches the **same conclusion**.

Two of the six duplicates additionally assert an "unheld" that is **held**, which is worse
than a duplicate — it puts a live blocker back on the board.

Score of the set: **9 survive** (2 of them the honest STILL_UNHELDs), **8 refuted**, 0 fatal.

---

## VERIFICATION LOG — every cite I opened

| claim | cite resolves? | quote verbatim? |
|---|---|---|
| ST-01 | ✅ `114_…:436-443` = `<achievement>/48/1/8041/8121/25/1/</achievement>` exactly; `118_…:5396/:5450/:5636/:5690` exact | ✅ |
| ST-02 | ✅ all 11 lines exact (1745/1748/1751/2273/2285/2288/2294/2330/2333/2378/2381) | ✅ |
| ST-03 | ✅ all 6 lines exact | ✅ |
| ST-04 | ✅ 2465/824/842/857 exact | ✅ |
| ST-05 | ✅ 2666/2669/2531/3875 exact; resname 4348 `/tteleport (territory x) (territory y)` confirmed at :3872 | ✅ |
| ST-06 | ✅ 938/941/1952/2645/2648 exact | ✅ |
| ST-07 | ✅ 2573/2576/2561/1472 exact | ⚠️ quote's *adjacency* assertion false — see below |
| ST-08 | ✅ all 15 lines exact; 161-166 = six `Target:` modes | ✅ |
| ST-09 | ✅ 4817/4829/4781/4784/4793 exact; exactly two PvP-ban strings in the whole table | ✅ |
| ST-10 | ✅ 7589/1808/1811 exact | ✅ |
| ST-11 | ✅ 7601/1358 exact | ✅ |
| ST-12 | ✅ 422 exact | ✅ |
| ST-13 | ✅ 1487 exact | ✅ |
| ST-14 | ✅ 7544 exact; all 3 PNGs exist, 1920×1080; I reproduced the stated crop | ⚠️ crop mis-described |
| ST-15 | ✅ 905/965/1136/1079 exact | ✅ |
| ST-16 / ST-17 | no cite, correctly (STILL_UNHELD) | — |

Structural facts I re-derived and confirm: 61 achievements, `<name>` = exactly 8000…8060,
`<desc>` = exactly 8080…8140, `+80` offset on **all 61** rows; resnames 8061-8079 and
8141-8159 are literal `AchievementNN` / `Achievement DescNN` placeholders (19 each); six
condition tiers at resnames 387-392; exactly three forge recipes and four Reinforce variants.

---

## THE EIGHT REFUTATIONS

### R1 — ST-01 achievements: already banked, in full, including the overturn
`docs/gauntlet/L0/systems/meta-social.md` §"Blocker ③ … → **OVERTURNED, ALL THREE, WITHOUT
RUFFLE**" already carries "**③a Achievements — 61 achievements, complete, with names,
descriptions, stat ids and thresholds**", the *identical* verbatim `<achievement>` row, and a
resolved id/stat/val table. `overturns_ledger: true` re-overturns a line already overturned.
**Survives:** the 19 unauthored placeholder slots (0 hits, confirmed by me) — real, new, and
the only part worth banking.

### R2 — ST-02 castle assault: three of its four assertions are false
- "appears in **none** of the ledger's 12 systems" → `meta-social.md:770` names **castle
  assault** as one of ten war-move-consuming operations.
- "states the territory victory rule blocker ② calls unknown" → `sources/uistrings-payload.md:160`
  already banks `strings.json["376"]` *"The Clan that captures all the control points in the
  battlefield will gain control of the territory"* and :164 says *"the shipped condition is
  control points."* **The survey's own §Z lists string 376 as already banked.** Internal contradiction.
- "only **board geometry** remains" → board geometry is the part that **is** held:
  `WarHexUI.as:2311-2316` (0…5 bounds), `WarHex.as:218-222` (per-sector `[N,S,E,W]` exit array),
  14 hex types incl. `HEX_CONTROLPOINT 3` / `HEX_CASTLE 12` / `HEX_VILLAGE 9` / `HEX_CITY 11`,
  3 terrain types — all in `meta-social.md`.
**Survives:** the castle-assault *objective* copy (flag room, defender spawn, gates, 3-hour
vulnerability window, Castle Level 1/3). 0 hits. Genuinely new.

### R3 — ST-07 piercing: four separate defects on one claim
1. **Adjacency is wrong.** 875/876 sit with the four **DEF** labels (871-874, lines 2561-2570).
   The four **ATK** labels are resnames **507-510, lines 1472-1481** — 368 ids and 1,101 lines
   away. "Same contiguous run as the four elemental ATK **and** four elemental DEF labels" is false.
2. **The build caveat is wrong.** `reference/extracted/ui_strings.txt:100` is the **WEB v0.717**
   payload and reads `…critical dmg: 1234-1235 *(heavy)piercing dmg: 20…`. Banked at
   `ui-hud.md:843`. There is no Android-only hole here.
3. **"The channel's arithmetic is not [held]" is wrong.** `combat-core.md:448` banks
   `Damage.as:150-172`: `lvl ≤ 10 → 1 + piercing … else lvl/4 + piercing`; and
   `items-equipment/stat-vs-level-curve` banks `ItemGenerator.as:150-183` **prog5 = PIERCINGDMG**.
4. **The labels are already banked** at `items-equipment/string-table-offset-drift`
   (`855 'Critical Damage' 856 'Piercing Damage' … AS3 uses 871-876`).
Net new information: none.

### R4 — ST-09 skill grammar: near-verbatim duplicate of two banked claims
`ui-hud/skill-icons-are-gestural` (`run2/CLAIMS.md:3401`) quotes **the same 6099/6100/6103**
and states hold-to-charge, hit-cancels-charge and drag-to-target. `meta-social/pvp-rooms-and-a-cut-steal-skill`
(`run2/CLAIMS.md:3221`) quotes **6111/6115** and states the two-skill PvP-room ban. Both are in
`SEEN_CLAIM_IDS.txt` (:1024, :992) and both are **stronger** — they bind the strings to skill ids
1046/1047/1049 and skilldata rows.

### R5 — ST-11 offline-duel AI: the artifact undercuts its own conclusion
The string is verbatim and 0-hit-new. The conclusion is not supported:
- `src/config/combat-sim.ts:117-125` — the shipped `ENEMY_BASE.hp` is **1**, and its own comment
  reads *"⚠️ THE AUTHORED BASE IS 1, NOT 150 (D3) … Our old 150 was a PvP-dummy seed modelling
  nothing."* There is no `150` anywhere in `src/config/` outside that comment. The claim defends
  a value that no longer exists.
- The string says the offline opponent is **that real player's samurai** under AI control — a
  level-scaled player stat block, which is precisely *not* a fixed 150-HP tier constant.
- `overturns_ledger: true` is false: the ledger sentence *"the shipped AI_TIERS/ENEMY_BASE are a
  PvP-duel dummy (hp 150), not the ~1-HP-chip field trash"* is **agreed with**, not disproven.
**Survives:** offline-duel-vs-AI is a real combat mode missing from the enemies-ai taxonomy.

### R6 — ST-12 carry weight: straight duplicate, same string, same conclusion
`docs/gauntlet/L0/CLAIMS.md:2415-2421`, `items-equipment/carry-weight-string-corroboration` —
HELD, ⚑ OVERTURNS LEDGER — quotes **string 138 verbatim** and its lane impact says *"overweight
blocks travel (not pickup), which string 138 states in the game's own words."* The `+20/level to
300` in the claim text is also lifted from `sources/skilldata.md:526` uncited.

### R7 — ST-14 stance ring: the premise about the banked claim is false
`run2/CLAIMS.md:5941-5947`, `ui-hud/stance-ring-colours-exact`: *"colours are exactly **#4242FF
(light)**, **#996600 (balanced)** and **#990000 (heavy)**"* — it **does** bind index → stance
name, with exact hexes. And `docs/research/REBUILD_READINESS.md:169` already carries the word
table: *"Portrait ring is stance-colored (Light blue / Balanced brown / Heavy red)."* So
"upgrades from a direction into an exact table" is wrong twice.
Also: the stated crop `200x170+10+915` does **not** contain the "HEAVY STANCE" caption. I
reproduced that exact box at ×4 lanczos — the caption sits at ≈x225-415, y≈1035, outside it. It
*is* in the frame (visible in crop `(0,860)-(700,1080)` ×2), so this is a crop-description slip,
not a false observation.
**What I confirm by my own eyes:** :7544 is verbatim, and the three frames do show a
violet-blue / khaki-tan / red annulus respectively. See NF-3 for the measured hexes.

### R8 — ST-15 war turn: "the turn LENGTH is still unheld" is false
`reference/decompiled/shs3_android/scripts/StatsManager.as:162` —
`internal static var WARMOVEINTERVAL:int = 60 * 60;`, consumed at :820
`nextWarTurn = QueryManager.instance.getServerTime() + WARMOVEINTERVAL`. Banked as
`world-exploration/war-tick-is-hourly` (HELD, ⚑ OVERTURNS LEDGER). The turn is **one hour**,
timestamp-driven. Worse: the claim lists *"Troops will advance on enemy sectors every 24 hours"*
as a live period without flagging that the banked AS3 claim says the ledger's 24-hour tick is
**wrong by 24×** — a rebuild reading this claim could code a daily war turn.

### R9 (minor) — ST-04 "sold per-clan" and ST-06 "unlock cadence"
- ST-04: the supply-and-demand market at :2465 **holds**. "sold **per-clan**" is in none of the
  four cited strings and is cut against by resname **4138** *"Crops can be sold at the Farmers'
  Market in town."* (Clan crops exist — 289-292, 807 — but that is a *collection* axis.)
- ST-06: the war-room level-10 gate is already banked with a **stronger A1 frame cite** at
  `sources/frames.md:237`. And the ledger's progression "unlock cadence" Ready-line is the
  **skill**-unlock cadence (`progression.md:508`: L3 Roll · L5 Focus · …), not content gates —
  mis-attribution. The level-2 duel and level-2/5 area gates are new.

---

## WHAT SURVIVES, AND IT IS GOOD WORK

**ST-05 Jigoku** is the best claim in the set — four verbatim cites, 0 corpus hits, a whole
room + state machine + GM verb set, and the `/tteleport (territory x) (territory y)` corroboration
of the world address space checks out at :3872.
**ST-13 inn = ⅓ max AP** — clean, new (`world-exploration.md:359` has the inn at +100 HP/+100 Chi
and no AP rule), and it explains why Soldier Pills stay saleable.
**ST-03 forge/reinforce ore names + quantities** — new, though `economy.md:475-486` already banks
the flat 5000 and *"Reinforce additionally burns reagent stats 20060–20065 in three level bands
(<30, <60, 60+)"*, which the claim should have cross-referenced: the **bands** decide *which* ore,
and only the code has them.
**ST-08's six targeting modes** — the ally-targeting branch is real and 0-hit-new. (Its
"Required Skill Points" is banked at `progression/required-is-skill-points`, and "cooldowns render
in seconds" is held far better by `XMLSkill.as:308-310` `val = levelList[lvl].cooldown * 24`.)
**ST-10 autoslash semantics**, **ST-16**, **ST-17** — honest, correctly scoped, held.

The survey's self-stated correction of the kickoff's "NOBODY HAS READ IT FOR MECHANICS IN FOUR
RUNS" premise was right, and §Z is exactly the right instrument. It just needed to be twice as
long, and the greps behind it needed to be case-insensitive single-token.

---

## LANE NOTE — the coverage-grep failure mode, so it does not recur

Multi-word, case-sensitive phrase greps against `docs/gauntlet/L0/{systems,sources,critics}`
produced six false "0 hits". Three fixes, all cheap:
1. grep **case-insensitively on the shortest distinguishing token** (`controlpoint`, `achievement`,
   `carrying too many`), not the marketing phrase.
2. include `docs/gauntlet/L0/CLAIMS.md`, `run2/CLAIMS.md`, `run2/claims.json` and `worklist/` —
   ST-09 and ST-12 were banked **only** there, not in `systems/`.
3. grep the **resname/id number itself** (`"138"`, `"6099"`, `"6111"`, `"376"`), which is
   build-agnostic and catches claims that paraphrased the text.
