# quests-story — HUNTER CRITIC (Lens 2: hunt under-claiming)

Blind review. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Method notes and refutations follow.

---

## Headline

The surveyor is **unusually precise on counts and line cites** — I re-derived the tag
histogram, the exp domain, the cutscene verb histogram, the portrait manifest and the
sha256 byte-check independently and they reproduce exactly. Line cites :128, :149, :153,
:158, :169, :183 land on the exact strings quoted.

But three verdicts are wrong, and two of them are the *most consequential* ones:

| # | claim | my verdict | severity |
|---|---|---|---|
| Q-04 | `choices-not-consequential` | **REFUTED** | **fatal** |
| Q-14 | `step-action-enum-semantics` STILL_UNHELD | **REFUTED — found it** | material |
| Q-15 | `outcome-id-namespace` STILL_UNHELD | **REFUTED — found it** | material |
| Q-07 | `questtype-taxonomy-wrong` | partially refuted | material |
| Q-03 / Q-10 | `18 <loot>` | wrong, it is **19** | minor |

---

## Q-04 — FATAL. Choices ARE consequential. The engine wires it positionally.

The surveyor's structural observation is true: `<outcome>` is **never a child of
`<choice>`**. I confirmed that by parentage — every one of the 386 `<outcome>` elements
sits at `quest/step/intro/outcome` (381) or `quest/step/ending/outcome` (5), never under
a choice.

**But the inference drawn from it is wrong.** The surveyor cites
`XMLQuestChoice.applyOutcome` and concludes from its emptiness that "the choice graph is
a flat jump table, not a consequence system". That is the wrong code path. The **live**
path is positional:

- `XMLQuestStep.getXMLIntroList` (XMLQuestStep.as:158-212) flattens `<intro>`'s children
  into one `displayList`; `case "option"` pushes the option **then one `null` pad per
  `<choice>`**.
- `CutsceneManager.gotoStep` (CutsceneManager.as:80-93) sets
  `this.currentDisplayNo = goto;` — `<goto>N</goto>` is a raw index into that list.
- `CutsceneManager.display()` (CutsceneManager.as:203-206) — `case "outcome":
  outcome.applyOutcome();` — **applies whatever outcome the walker reaches.**

So a choice selects a *branch*, and the branch carries its own `<outcome>` nodes.
Consequence is positional, not nested.

**I validated my index model against the surveyor's own hand-traced Prologue** before
trusting it: rebuilding the displayList puts index 9 exactly on *"Sorry, but I don't
submit to bandits…"* and index 15 exactly on *"I say how about I hand over half the
length of this sword…"*, both reconverging at `label2` (index 10). That reproduces the
surveyor's trace, so the model is sound.

Running that walker over all 195 multi-choice `<option>` blocks:

```
options with >=2 choices: 195
DIVERGENT outcome branches: 54
```

Concrete divergences (verbatim from the walk):

```
-- questdata.xml:971
   Let's start mining.  -> set 113=8402942, set 114=2, set 115=350, set 102=0, END 1
   Not right now.       -> END 1
-- questdata.xml:814
   (Fighting Tutorial)  -> set 113=8402944, set 114=4, set 102=0, END 1
   I should go.         -> END 1
-- questdata.xml:1851
   I should learn more about Satoshi. -> (further option)
   Bah! I know where I'm not wanted.  -> set 110=12, END 1
-- questdata.xml:2410
   (branch A) -> END 1
   (branch B) -> set 30017=3, END -1
```

`end` itself diverges too: `1` = `leaveOK()`, `-1` = `leaveCancel()` (XMLQuestOutcome.as:78-89).
Different choices therefore *start or cancel the fight*.

**The Prologue — the one case the surveyor traced — happens to be a reconverging one.
It was generalised to all 471.** 54/195 is not "a flat jump table".

⚠ The lane impact is the dangerous part: *"drops a large chunk of L1's assumed runtime
risk"* would tell L1 **not** to build the consequence system, breaking 54 options.

---

## Q-14 — FOUND IT. `<step><action>` is `GameEngine.ACTION_*`, a 15-value enum.

The surveyor left this STILL_UNHELD with a close-path. The close-path works.
`QuestEngine.as:1218` passes it straight through:

```
GameEngine.initBattleMode(quest,questStepData.action,questStepData.bg,questStepData.stagewidth,questStepData.time,questStepData.wave,startingPosX);
```

`GameEngine.as:81-109`:

```
ACTION_NOTHING 0 · ACTION_FIGHT 1 · ACTION_ASSASSINATE 2 · ACTION_ESCORT 3
ACTION_SURVIVE 4 · ACTION_REACHMARKER 5 · ACTION_DUEL 6 · ACTION_ADVENTURE 7
ACTION_HARVEST 8 · ACTION_SURVIVALMODE 9 · ACTION_WARROOMBATTLE 10
ACTION_PLAYBACK 11 · ACTION_PVPROOM 12 · ACTION_CUTSCENE 13 · ACTION_SURVIVECLEANUP 14
```

The surveyor's own measured domain now reads directly:
**0 NOTHING ×169 · 1 FIGHT ×37 · 6 DUEL ×5 · 14 SURVIVECLEANUP ×3 · 4 SURVIVE ×1.**

---

## Q-15 — FOUND IT. The `<outcome><id>` namespace is the StatsManager stat-id table.

`XMLQuestOutcome.applyOutcome` (XMLQuestOutcome.as:50-90) gives exact range semantics:

```
id == 11                      + modify>0 -> lootDialog.addLootCoins(modify)     (STAT_GOLD)
id >= 2000 && id < 30000      + modify>0 -> lootDialog.addLootItemBasic(id,modify)  -> ITEM GRANT
id == StatsManager.STAT_XP (9)           -> lootDialog.addLootXP(modify)
else                          + modify   -> StatsManager.changeStat(id,modify)
hasSet (no modify)                       -> StatsManager.setStat(id,setNo)
end == -1 leaveCancel() · end == 1 leaveOK() · else nextStep()
```

`StatsManager.as:170-260` names the whole namespace (STAT_HP 0 … STAT_LOCATION_ROOM 43,
STAT_FIREDEF 200 … STAT_PIERCINGDMG 205). Measured usage in questdata:

- **SET ids:** 43, 100, 102, 108-116, 118-121, 126-130, 2211, 30017, 40000, 40002
- **MODIFY ids:** **42**, 20030, 20040

**id 42 is `STAT_CHIKAKOLOVE`** (StatsManager.as:246) — a named romance/affection meter,
`+1` three times at questdata.xml:8776/8785/8794. **id 43 is `STAT_LOCATION_ROOM`.**
20030 / 20040 fall in the 2000-30000 window, so they are **item grants** made inline from
dialogue. Ids ≥100 outside the named table are generic story flags via `setStat`.

This is exactly the "flag namespace = the save-game's story section" the surveyor wanted.

---

## Q-07 — partially refuted. escort / gather / timed / bounty are REAL engine constants.

`QuestType.as:6-24` is confirmed 9-valued, and the `<type>` histogram reproduces exactly
(`{2:37, 4:22, 0:2}`). That half holds.

But the sub-claim *"a 9-value enum containing none of trade/bounty/escort/gather/timed"*
is **wrong at the engine level**. Those terms map onto real constants — in the
*orthogonal* per-step enum found above:

- bounty → `ACTION_ASSASSINATE` (2) · escort → `ACTION_ESCORT` (3)
- timed → `ACTION_SURVIVE` (4) · gather → `ACTION_HARVEST` (8)

The ledger's taxonomy was **conflating two orthogonal enums (QuestType × StepAction)**,
not inventing categories. Telling L1 to "build the 9-value enum, not the invented 7" would
throw away four real engine modes.

---

## New findings the surveyor missed (hunter lens)

**H-1 — 12 nested waves / 18 extra enemy rows hidden inside room-object properties.**
Enemy parentage is *not* uniform:

```
151  quest/step/wave/enemy
 18  quest/step/roomobj/property/obj/property/xml/wave/enemy
```

Six `<property>` elements contain a **nested `<xml>` document** holding its own `<wave>`
list (first at questdata.xml:20569). True totals: **169 `<enemy>`, 118 `<wave>`** (106
step-level + 12 nested). L4's encounter table is short by 18 rows and 12 waves.

**H-2 — 114 of 169 enemy rows use a PIPE-DELIMITED random spawn pool.**
`<id>19|20|21|22|23|24</id>`, `<id>11|12|13|14|15</id>` — the id field is a *pool*, not a
scalar. The claim's framing ("151 rows with level and spawn x", ids resolved via
resolved_names) silently assumes scalar ids; two thirds of the rows are randomised picks.
This changes the spawner contract, not just the table.

**H-3 — the `<condition>` grammar is fully recoverable** (surveyor left it vague).
`StatsManager.checkConditions` (StatsManager.as:4152-4260) closes it:
`<has><id><qty><comp>` with `comp` defaulting to `"gte"`; `<completedquest>` supports a
**`!` negation prefix**; `<activequest>` is an **OR** set (any match passes) while `has`
and `completedquest` are ANDs. `checkCondition` also implements a **`"rand"` comparison**
(`Math.random() * id <= val`) — probabilistic gating. With 62 `<condition>` + 17
`<startcondition>` + 97 `<activequest>` + 32 `<completedquest>`, the **quest prerequisite
DAG** is on disk and unclaimed.

**H-4 — `<ending>` is a second, unmentioned dialogue track.**
`XMLQuestStep` carries **both** `intro` and `ending` vectors (XMLQuestStep.as:130-131),
built by the same `getXMLIntroList`. 5 `<ending>` blocks exist, with their own
`option/choice` (2) and `outcome` (5). Every claim in this unit is scoped to `<intro>`;
post-battle scenes are a separate track.

**H-5 — `<loot>` is 19, not 18** (Q-03 and Q-10 both say 18). Measured
`19 quest/step/reward/loot`.

---

## Confirmed by my own hands (no dispute)

- **Q-05** — I re-ran the byte check: web 796383 B / android 796384 B, `android[:-1]==web`
  True, both sha256 `e8ecb01f…d2e`. And the premise holds: `reference/decompiled/shs3_payload`
  has 1079 `.as` files all named `§1t5574s0§.as`-style — fully obfuscated, no named quest
  classes. Cleanly HELD.
- **Q-06** — I extracted t=62 and t=68 from `zFtCaTO0_1M.mp4` myself, cropped
  `crop=1400:360:0:700` and upscaled ×1.5, and **looked**. Nameplate JINBEI reads
  *"IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE
  DRIVEN ALL THE HONEST FOLK AWAY."* — genuinely different from questdata.xml:128.
  Nameplate GUEST shows two rows: *"I'LL STAND MY GROUND…"* (= :149 exact) and
  *"THESE BANDITS DON'T SCARE ME!"* (≠ :153 *"They'll get nothing from me!"*).
  **The frame wins, and the surveyor said so out loud. Correctly graded PARTIAL — this is
  the most honest claim in the set.**
- **Q-09** — same crop: the player nameplate reads **GUEST**. `resolved_names.json`
  npcdata `161 -> Satoshi`. HELD.
- **Q-12** — verb histogram reproduces *exactly* (399 commands, 15 verbs, anim 107 / walk
  76 / create 75 / …), time range 0.0-8.0, x range -200..1600.
- **Q-13** — npcdata resolves exactly one `Yasuka` (id 156). HELD. (Sidenote: Chikako
  resolves to *three* ids — 171, 172, 811 — and Yuudai to three — 154, 168, 180. The
  "one name = one person" check is not general.)
- **Q-01, Q-02, Q-08, Q-10** — all cites land verbatim; QuestLogUI 7-row scroller geometry
  (x=60, y=73+55i) and the unbounded `activeQuests` + `maxRow = maxLength - 7` confirmed.

## Score

78 is **too high given Q-04 is backwards**. Q-14/Q-15 being closed pushes up; Q-04 being
wrong (and pointed the wrong way for L1) pushes down harder, because it would remove a
system the data demands. Net: **~72**, and Q-04's lane impact must be reversed before L1
consumes this.
