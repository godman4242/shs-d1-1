# CITE-LENS CRITIC — unit `quests-story`

Blind review. I did not see the surveyor's reasoning. For every claim below I opened
the cited artifact myself and, where the claim was a measurement, re-derived it from
the raw file. Frames were re-extracted from the source video by me, cropped and
upscaled, and looked at.

**Headline:** 13 of 15 claims survive with their cites resolving exactly. **One claim is
fatally wrong** (`choices-not-consequential`) — its measurement is true but its
conclusion is the opposite of what the engine does, and I have a verified
counterexample. Three claims carry small numeric slips. Both `STILL_UNHELD` claims are
honest, and I close both with new payload cites.

---

## Method

- Parsed `reference/extracted/questdata.xml` with `xml.etree` and re-derived every count
  by tag PATH (not raw `grep`), because several tags occur at more than one path.
- Re-ran the byte comparison in Q-05 from scratch.
- Re-extracted the video frames with `ffmpeg -ss <t> -i reference/videos/zFtCaTO0_1M.mp4`,
  cropped `crop=1920:340:0:720` and `crop=1400:360:0:700`, upscaled, and READ them.
- Read every cited `.as` file at the cited line numbers.

---

## Verdict table

| claim | cite resolves | measurement reproduces | verdict |
|---|---|---|---|
| verbatim-script-held | YES | YES | HOLDS, one clause must be struck |
| ep4-12-epilogue-shipped | YES (6/6 lines) | YES | HOLDS |
| triggers-coords-rewards-tabled | YES | YES except `<loot>` 19 not 18 | HOLDS, fix number |
| choices-not-consequential | YES | YES | **REFUTED — conclusion inverted** |
| android-caveat-retired | YES | YES (sha256 identical) | HOLDS |
| frame-beats-payload-dialogue-rewritten | YES (I re-extracted) | YES, every string | HOLDS |
| questtype-taxonomy-wrong | YES | YES exactly | HOLDS |
| quest-log-cap-is-a-row-count | YES | YES | HOLDS |
| player-name-satoshi-resolved | YES | YES except `satoshi*` 411 not 406 | HOLDS, fix number |
| reward-and-roster-undercount | YES | YES except `<loot>` 19 not 18 | HOLDS, fix number |
| ally-waves-unlisted-system | YES | YES, every id and range | HOLDS |
| cutscene-director-held | YES | YES, histogram exact | HOLDS |
| two-yasukas-confirmed | YES (`:1508`) | YES | HOLDS |
| step-action-enum-semantics | n/a (STILL_UNHELD) | n/a | honest — **I close it** |
| outcome-id-namespace | n/a (STILL_UNHELD) | n/a | honest — **I close most of it** |

---

## THE REFUTATION — `quests-story/choices-not-consequential` (FATAL)

**The claim:** *"Blocker (4) is ANSWERED and the answer is no ... all 471 are pure
`<goto>` jumps ... the choice graph is a flat jump table, not a consequence system."*

**Its measurement is TRUE.** I reproduced it exactly by path-parse:
`questdata/quest/step/{intro,ending}/option/choice` = 469 + 2 = **471**; `choice/goto`
471; `choice/condition` **7**; `choice/gotolabel` **0**; `choice/outcome` **0**.
`XMLQuestChoice.as:38-47` `applyOutcome()` is verbatim as quoted, and it is dead code.

**Its conclusion is WRONG.** The engine does not express choice consequence through a
`<choice><outcome>` child. It expresses it **positionally**. Three payload facts, each
opened by me:

1. `XMLQuestStep.as:160-214` `getXMLIntroList()` flattens the `<intro>` children into a
   `Vector.<XMLQuestIntro>` **display list**, and on `case "option"` it pushes the option
   *and then one `null` per `<choice>`*:
   ```
   case "option":
      questOption = new XMLQuestOption(currentDisplay);
      vectorList.push(questOption);
      max = int(questOption.choice.length);
      for(j = 0; j < max; j++)
      {
         vectorList.push(null);
      }
   ```
2. `CutsceneManager.as:80-102` `gotoStep()` sets `currentDisplayNo = goto` — the
   `<goto>` integer is an **index into that display list** — then `display()`.
3. `CutsceneManager.as:202-205` — when the walk reaches an `outcome` entry it calls
   `XMLQuestOutcome.applyOutcome()`, which writes game state
   (`StatsManager.setStat` / `changeStat` / item + coin grants, `XMLQuestOutcome.as:50-90`).

So **whether a choice has consequences depends on which `<outcome>` nodes lie on the
path its `<goto>` lands you in.** The surveyor never asked that question; it tested only
for the unused direct hook.

**Verified counterexample — Prologue (`quest id 0`), step index 8, `<intro>`.** Display
list rebuilt under the engine's own rule (3 choices → 3 `null` pads at 7/8/9):

```
 5  label   label1
 6  option  "What's his story?"->10 | "(FIghting Tutorial) I may be able to learn something here."->14 | "I should go."->19
 7  null (choice pad)
 8  null (choice pad)
 9  null (choice pad)
10  dialogue  "So you served in the Old Guard?"
13  goto      label1
14  dialogue  "You said before that I'd be able to practice my sword technique here. Is the invitation still open?"
16  outcome   id=113 set=8402944 end=0
17  outcome   id=114 set=4        end=0
18  outcome   id=102 set=0        end=1
19  dialogue  "I'll leave you to your business."
20  outcome   id=(none) modify=0  end=1
```

- Choice **"(FIghting Tutorial)…"** → index 14 → terminates at 18 having applied
  **`setStat(113, 8402944)`, `setStat(114, 4)`, `setStat(102, 0)`** — three writes.
- Choice **"I should go."** → index 19 → terminates at 20 having applied **no stat write
  at all** (`id` absent → `XMLQuestOutcome.as:22-29` sets `id = -1`, and `:52` gates every
  write behind `if(this.id >= 0)`).

That every `<goto>` lands on a semantically correct line ("What's his story?"→"So you
served in the Old Guard?", "I should go."→"I'll leave you to your business.") independently
validates the index model.

**Scale.** Simulating the engine's traversal over the whole file:
- **12** shipped `<option>` blocks where *every* branch terminates and the applied
  outcome sets differ. (Conservative floor.)
- **86** `<option>` blocks where the branches diverge in applied outcomes at all
  (includes branches that reach a nested option).

The Prologue's Jinbei option — the surveyor's one worked example — genuinely does
reconverge on `label2`. It generalised from that single sample.

**Consequence for the board:** the lane_impact *"drops a large chunk of L1's assumed
runtime risk"* is backwards. L1 must implement the display-list walker, the
`null`-padded index space, and outcome application at traversal time. Building a "flat
jump table" would silently drop 3 stat writes in the Prologue alone.

---

## Small numeric corrections (claims still stand)

| claim | says | actual | evidence |
|---|---|---|---|
| triggers-coords-rewards-tabled, reward-and-roster-undercount | `18 <loot>` | **19** | path `quest/step/reward/loot` = 19 |
| triggers-coords-rewards-tabled | quote shows 2 loot rows for `:442-456` | the cited range holds **3** | `:453-456` `<id>20108</id>` = "Crane Feather", which also resolves |
| player-name-satoshi-resolved | `satoshi*` ×406 | **411** | `satoshi` 176 + `satoshi_serious` 209 + `satoshi_happy` 21 + `satoshi_drunk` **5** (missed) |
| outcome-id-namespace | 194 `<set>` write 28 ids (42..40002) | `<set>` rows write **25** ids (43..40002); **28** is the id count over all 386 `<outcome>` | two different populations conflated |

`triggers-coords-rewards-tabled`'s unexplained `14` resolves correctly: it is
`quest/step/teleportposx` (14 rows, paired with 14 `teleportnode`). 348 + 52 + 14 + 97 all
confirmed by path.

## One clause to strike

`verbatim-script-held` ends *"…so those lines are what the game renders."* My own frame
extraction disproves that for 4 of 6 comparable Prologue strings. **The frame wins.** The
claim's ledger overturn stands in full; the trailing clause must be reworded to
*"…so those lines are what the client holds; on-screen wording is only confirmed where a
longplay shows the scene."*

## One cite-hygiene note (not a refutation)

`frame-beats-payload-dialogue-rewritten` cites the `.mp4` plus a path inside the
surveyor's own private scratchpad. §0's A1 artifact class is a file under
`reference/frames/`. I reproduced every string independently, so the finding is sound —
but the extracted frames should be written into `reference/frames/` so the cite is
re-openable by anyone who is not that agent.

---

## What I confirmed by looking (A1)

`reference/videos/zFtCaTO0_1M.mp4`, 1920×1080, crop `(0,700)-(1920,1060)` and
`(0,700)-(1400,1060)`, upscaled:

- **t=62 s**, nameplate **JINBEI**: "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS.
  IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY."
  → `questdata.xml:128` "Ah! A new face in this territory! My, it isn't often we see
  people walk this road alone…" **DIFFERENT.**
- **t=68 s**, nameplate **GUEST**, two stacked rows: "I'LL STAND MY GROUND AND ASK THEM
  TO LEAVE ME ALONE." (= `:149` **exact**) / "THESE BANDITS DON'T SCARE ME!"
  (vs `:153` "They'll get nothing from me!" **DIFFERENT**).
- **t=72 s**, **GUEST**: "HOW ABOUT I HAND OVER HALF THE LENGTH OF THIS SWORD -- SHARP
  END FIRST. WILL THAT SUFFICE AS PAYMENT?" (vs `:183`, which prefixes "I say ").
- **t=76 s**, **JINBEI**: "THAT'S TOO BAD, TRAVELER. IT REALLY IS…"
  (vs `:169` "WHAT–?! You dare defy Jinbei the Bandit King…" **DIFFERENT**).
- `reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg` (480×270, upscaled 1.6×): header
  **PLAYER**, paperdoll name field **SOUND360TM**, WEIGHT 116/100, GOLDEN TOKEN
  "USED FOR ENTERING TOURNAMENTS AND FOR PLACING FIGHT BETS / QUEST ITEM".

The picked branch at t=72 is row 2 (`<goto>15</goto>`), and display-list index 15 in that
`<intro>` is exactly `<text>I say how about I hand over half the length of this sword…`.
The video independently confirms the `null`-pad index model above.

---

## NEW FINDINGS

### NF-1 — the `<step><action>` enum is `GameEngine.ACTION_*` (closes `step-action-enum-semantics`)

`QuestEngine.as:1219` passes the step's action straight through as the battle-mode action type:

```
GameEngine.initBattleMode(quest,questStepData.action,questStepData.bg,...)
```
against `GameEngine.as:990` `initBattleMode(quest:int, actionType:int, ...)`. The enum is
`GameEngine.as:81-109`:

```
ACTION_NOTHING 0 · ACTION_FIGHT 1 · ACTION_ASSASSINATE 2 · ACTION_ESCORT 3 ·
ACTION_SURVIVE 4 · ACTION_REACHMARKER 5 · ACTION_DUEL 6 · ACTION_ADVENTURE 7 ·
ACTION_HARVEST 8 · ACTION_SURVIVALMODE 9 · ACTION_WARROOMBATTLE 10 ·
ACTION_PLAYBACK 11 · ACTION_PVPROOM 12 · ACTION_CUTSCENE 13 · ACTION_SURVIVECLEANUP 14
```

So the measured domain names itself:

| value | name | steps |
|---|---|---|
| 0 | ACTION_NOTHING (talk / interact inline) | 169 |
| 1 | ACTION_FIGHT | 37 |
| 4 | ACTION_SURVIVE | 1 |
| 6 | ACTION_DUEL | 5 |
| 14 | ACTION_SURVIVECLEANUP | 3 |

Corroborated at two independent consumers: `Obj_NPCAggro.as:214`
`if(questAction != null && questAction.action == 0) { this.interact(); }` — action 0 opens
dialogue in place rather than transitioning; `Obj_NPCAggro.as:139` `if(questAction.action == 6)
{ QuestEngine.putInDuelistHolder(...) }` and `QuestEngine.as:1214-1216` `if(questStepData.action == 6)
{ startingPosX = 150; }`.

**Lane impact — L1:** the trigger dispatch is a 15-value enum, of which the campaign uses 5.
Only **5 of 225 story steps are duels**; 37 are fights; 169 are pure dialogue. That is a
materially different build order than "quest state machine, trigger types unknown".
Also L2/L4: `ACTION_DUEL` steps start the player at x=150 instead of 400.

### NF-2 — `<outcome><id>` is the `StatsManager` stat-id namespace, with an item band (closes most of `outcome-id-namespace`)

`XMLQuestOutcome.as:50-90`:

```
if(this.id >= 0) {
   if(this.hasModify) {
      if(this.id == 11 && this.modify > 0)                    -> lootDialog.addLootCoins(modify)
      else if(this.id >= 2000 && this.id < 30000 && modify>0) -> lootDialog.addLootItemBasic(id, modify)
      else if(this.id == StatsManager.STAT_XP)                -> lootDialog.addLootXP(modify)
      else                                                    -> StatsManager.changeStat(id, modify)
   } else if(this.hasSet)                                     -> StatsManager.setStat(id, setNo)
}
if(end == -1) leaveCancel(); else if(end == 1) leaveOK(); else nextStep();
```

So: `<id>` is a **stat id**, except in the band `[2000, 30000)` with `<modify>` where it is an
**itemdata item id**. Confirmed against the observed domain:

- `id 11` = `STAT_GOLD` (`StatsManager.as:192`) → coin grant.
- `id 9` = `STAT_XP` (`:188`) → xp grant.
- `id 42` = **`STAT_CHIKAKOLOVE`** (`StatsManager.as:246`) — appears 3× as
  `<outcome><id>42</id><modify>1</modify><end>1</end></outcome>`. **The campaign contains an
  affection/romance stat.** No ledger system mentions one.
- `id 43` = `STAT_LOCATION_ROOM` (`:248`).
- `id 2211 / 20030 / 20040` fall in the item band and resolve via
  `docs/gauntlet/L0/index/resolved_names.json` to **"Dragon Dance Scroll" / "Kanji Gourd" /
  "Crops"** — these are item grants, not flags.
- `id 100..130` are above the named stat block → free story-flag slots written with
  `setStat`.

`<end>` is also now a named 3-value enum: `-1` = leaveCancel (abort, quest step not
advanced), `1` = leaveOK (step complete), `0`/absent = continue to next display entry.

**Lane impact — L1 + L9 save schema:** the quest flag namespace is the *stat* array, not a
separate story-flag table. `STAT_CHIKAKOLOVE` and the item band must both be modelled.
What remains genuinely unheld: the human meaning of ids 100–130 individually.

### NF-3 — `<goto>` indexes a `null`-padded display list, not the XML child list

Already spelled out in the refutation above. Filed separately because it is a standalone
implementation requirement: **every `<goto>` integer in the campaign is offset by the
running count of `<choice>` elements in all preceding `<option>` blocks in the same
`<intro>`.** An implementation that indexes raw XML children will mis-route every branch
after the first option — in the Prologue's Jinbei scene, `<goto>15</goto>` would run off the
end of a 15-element child list instead of landing on "I say how about I hand over half the
length of this sword". Cite: `XMLQuestStep.as:193-201` + `CutsceneManager.as:80-102`, and
the video at t=72 shows the correct destination on screen.
