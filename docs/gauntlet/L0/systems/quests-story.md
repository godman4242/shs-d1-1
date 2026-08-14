# GAUNTLET L0 — SYSTEM SURVEY: **quests-story** (ledger score 42/100)

- **Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 table row,
  §4 `### quests-story — 42` block, §3 correction #8, §6 "structurally UNRECOVERABLE".
- **Surveyor:** L0 system surveyor, 2026-08-14.
- **Law:** §0 — every claim carries exactly one artifact class + cite. `STILL_UNHELD` is a
  correct answer. Where a frame and a doc disagree, **the frame wins** and I say so.
- **Headline:** the §4 block has **4 blockers; 3 are dead and 1 is answered.** But the
  single most important thing found this pass is a **frame-vs-payload disagreement** that
  nobody has flagged: `questdata.xml` is script-COMPLETE but **not verbatim-identical** to
  what the shipped build renders. That correction cuts BOTH ways and is claim Q-06.

---

## Q-01 — §6's "the actual script is gone" is FALSE. 3,307 verbatim `<text>` lines are on disk.

**Ledger sentence (§6, "What is structurally UNRECOVERABLE"):**
> "**Verbatim dialogue** — if the story is server-fetched and the server is dead, the actual
> script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires
> original dialogue anyway)."

**Ledger sentence (§4 quests-story, blocker ①):**
> "① **verbatim dialogue — captured NOWHERE** (study policy + no wiki transcripts)"

**A2 — `reference/extracted/questdata.xml:128`, quoted verbatim:**
```
        <text>Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it...</text>
```
The dialogue is **not** server-fetched. It is a static XML blob in the client payload:
2,771 `<dialogue>` (2,755 under `step/intro`, 16 under `step/ending`) and 3,307 `<text>`
elements, 796,383 bytes.

Proof it renders literally and is not a localisation key — **A2,
`reference/decompiled/shs3_android_payload/scripts/LangManager.as:95–100`:**
```
      public static function getQuestString(id:String) : String
      {
         if(id.charAt(0) != "I" || id.charAt(1) != "D")
         {
            return id;
         }
```
`questdata.xml`'s `<text>` values are plain English, never `ID…`, so `getQuestString`
returns them unchanged. There is no second, hidden script.

**Verdict: HELD · overturns ledger §6 and §4 blocker ①.**

---

## Q-02 — §4 blocker ② "Ep4–12 + epilogue (10 undocumented chapters)" is DEAD. All 15 chapters ship, plus a Season-2 hook.

**Ledger sentence (§4 quests-story, blocker ②):** > "② **Ep4–12 + epilogue** (10 undocumented chapters)."
**Ledger sentence (§3 correction 8):** > "Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely never shipped. **Scope decision:** faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."

**A2 — `reference/extracted/questdata.xml`, quest-level `<title>` rows:**

| line | quoted |
|---|---|
| 5 | `  <title>Prologue</title>` |
| 8521 | `  <title>Episode 4</title>` |
| 24869 | `  <title>Episode 12</title>` |
| 27347 | `  <title>Epilogue</title>` |
| 27697 | `  <title>Season 2</title>` |

61 `<quest>` blocks total; Episodes 1–12, Prologue and Epilogue are all present **with full
step chains, cutscenes, waves and rewards** — not stubs. Episode 12's script is real prose,
e.g. `questdata.xml:24910`: `        <text>So this is it... the final battle.</text>`.

The **only** thing genuinely unshipped is Season 2, and the game says so itself —
**`questdata.xml:27710` and `:27726`:**
```
    <title>(Unreleased) The adventure continues...</title>
...
      <text>This episode is not yet released. Return here when the episode is released to continue the story!</text>
```

**Verdict: HELD · overturns ledger §4 blocker ② and §3 correction 8's scope decision.**
The faithful campaign is **Prologue → Ep1–12 → Epilogue = 14 chapters**, all recoverable.

---

## Q-03 — §4 blocker ③ "per-quest trigger types + coords + rewards (sampled, not tabled)" is DEAD — the whole table is on disk and the item ids resolve to names.

**Ledger sentence:** > "③ per-quest trigger types + coords + rewards (sampled, not tabled)."

**A2 — measured over `reference/extracted/questdata.xml`** (index
`docs/gauntlet/L0/index/questdata.json` concurs):

- **Triggers:** 225 `<step>`, each carrying `<node>` (world node id, 8,382,465–8,910,829)
  and `<roomobj><room>` (0–113) + `<roomobj><id>` (15 distinct object types).
  215 steps carry `<action>` — measured domain **{0:169, 1:37, 6:5, 14:3, 4:1}**.
  17 quests carry `<startcondition>`, 15 of them gated `<completedquest>`.
- **Coords:** 348 `roomobj/property/obj/x` (−1000…5000), 52 `roomobj/x` (0…2800),
  14 `<teleportnode>` + 14 `<teleportposx>` (831…2000), 97 `wave/enemy/x` (−400…2000).
- **Rewards, fully tabled:** 77 `<reward>` blocks — 69 `<exp>` with a **closed 10-value
  domain {100, 200, 250, 290, 500, 600, 750, 1000, 2000, 3000}**, and 18 `<loot>` rows
  each `<id>/<qty>/<chance>`. Every loot id resolves against the S0-3 string table.

**A2 quote — `reference/extracted/questdata.xml:442–456`:**
```
    <reward>
      <loot>
        <id>13100</id>
        <qty>1</qty>
        <chance>1</chance>
      </loot>
      <loot>
        <id>2103</id>
        <qty>5</qty>
        <chance>1</chance>
      </loot>
```
Resolved via `docs/gauntlet/L0/index/resolved_names.json`: `13100` → **Iron Sword**,
`2103` → **Small Rice Ball**, `20108` → **Crane Feather**, `2211` → **Dragon Dance Scroll**,
`20110` → **Inokichi's Club (Broken)**, `20037` → **Kitten**.

**Verdict: HELD · overturns ledger §4 blocker ③.**

---

## Q-04 — §4 blocker ④ "are player choices consequential?" — ANSWERED, and the answer is NO. Zero of the 471 shipped choices apply an outcome.

**Ledger sentence:** > "④ are player choices consequential?"

**A2 — the engine CAN do it. `reference/decompiled/shs3_android_payload/scripts/XMLQuestChoice.as:38–47`:**
```
      public function applyOutcome() : *
      {
         var outcomeXML:XMLQuestOutcome = null;
         var max:int = this.outcome.length();
         for(var i:int = 0; i < max; i++)
         {
            outcomeXML = new XMLQuestOutcome(this.outcome[i]);
            outcomeXML.applyOutcome();
         }
      }
```

**A2 — the shipped data never uses it.** Measured over all 471 `<choice>` blocks in
`reference/extracted/questdata.xml`:

| field on a `<choice>` | count |
|---|---|
| `<goto>` | **471 / 471** |
| `<outcome>` | **0 / 471** |
| `<condition>` | 7 / 471 |
| `<gotolabel>` | 0 / 471 |
| `<text>` | 467 / 471 (4 silent auto-branches) |

So a choice is a **pure jump inside one step's dialogue stream**; 7 are gated by
`<has>`/`<completedquest>` (grammar: `eq`, `gt`, `gte`, `not`, and `!N` negation — e.g.
`questdata.xml:2182` `<completedquest>!4</completedquest>`); none mutates state on its own.

**A2 — worked example, `questdata.xml:146–185`.** The Prologue's only choice offers
`<goto>9</goto>` and `<goto>15</goto>`; both paths reconverge on `<label>label2</label>`
(`:161`) and terminate in the same `<outcome><modify>0</modify><end>1</end></outcome>` —
the same fight, either way.

**Verdict: HELD · answers ledger §4 blocker ④.** Player choices in SHS:D are *flavour +
gating*, not branching consequence. This is a **cheap** system to reproduce 1:1, and the
ledger should stop treating it as an open risk.

---

## Q-05 — the ANDROID CAVEAT DOES NOT APPLY TO THIS SYSTEM. The web and Android story data are byte-identical.

Stage-0b's standing caveat is that Android is `clientVersion 0.682` vs web `0.717`, so
"UI copy and combat tuning parity is NOT established". For **quests-story that caveat is
retired**, measured:

**A3 — byte check, pasted output:**
```
$ cmp "reference/extracted/questdata.xml" "reference/extracted/android/116_Mobile_QuestData.bin"
cmp: EOF on reference/extracted/questdata.xml
$ python3 -c "...":
android len 796384 web len 796383
android[:-1]==web ? True
android last byte b'\n'
sha256 web        e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e
sha256 android[:-1] e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e
```
`cmp` reports EOF with **no differing byte** ⇒ the web file is a strict prefix; the only
delta is one trailing `\n`. Consequence: the readable Android quest-engine AS3
(`XMLQuest*.as`, `QuestEngine.as`, `QuestType.as`) is a legitimate source for this lane —
which matters, because the **web** payload's ActionScript is obfuscated
(`reference/decompiled/shs3_payload/scripts/§1t398s0§.as` etc., 0 quest classes),
while `shs3_android_payload/scripts/` carries **53 named quest classes**.

**Verdict: HELD.** Label ported quest *code* "Android v0.682"; quest *data* needs no label.

---

## Q-06 — ⚠️ FRAME BEATS PAYLOAD: the shipped build's Prologue dialogue is **REWRITTEN** relative to `questdata.xml`. Nobody has flagged this.

This cuts against the payload, so it is the most important claim here. **Per the standing
invariant, when the payload and a frame disagree, THE FRAME WINS — and it disagrees.**

**A1 — `reference/videos/zFtCaTO0_1M.mp4` @ t=62 s, 66 s, 68 s, 72 s, 76 s.** 1920×1080
frames extracted with `ffmpeg -ss <t> -frames:v 1`; **crop used: `(0,700)–(1400,1060)`**
(the bottom-anchored parchment dialogue box + nameplate tab), then a 5-up contact sheet at
640×360 per panel. Scratch crops:
`/private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad/qframes/`
(`t62.png … t76.png`, `sheet.png`). What is **visibly** in the crops, transcribed:

| t | nameplate | on-screen line (visible in crop) | `questdata.xml` counterpart | match |
|---|---|---|---|---|
| 62 | JINBEI | "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY." | `:128` "Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it..." | ✗ **rewritten** |
| 66 | JINBEI | "BUT I'LL TELL YOU WHAT, BECAUSE WE'RE SUCH A FRIENDLY BUNCH, ME AND MY FRIENDS WILL ESCORT YOU TO THE NEAREST TOWN, AND ALL IT'LL COST YOU IS HALF OF WHAT YOU'RE CARRYING." | `:138` "If you want, I can guarantee you safe passage through the area -- and all it'll cost you is half of what you're carrying." | ✗ **rewritten** (tail clause survives) |
| 68 | GUEST | choice row 1 "I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE." | `:149` "I'll stand my ground and ask them to leave me alone." | ✓ **exact** |
| 68 | GUEST | choice row 2 "THESE BANDITS DON'T SCARE ME!" | `:153` "They'll get nothing from me!" | ✗ **rewritten** |
| 72 | GUEST | "HOW ABOUT I HAND OVER HALF THE LENGTH OF THIS SWORD -- SHARP END FIRST. WILL THAT SUFFICE AS PAYMENT?" | `:183` "I say how about I hand over half the length of this sword -- sharp end first. Will that suffice as payment?" | ≈ **near-exact** (drops "I say") |
| 76 | JINBEI | "THAT'S TOO BAD, TRAVELER, IT REALLY IS..." | `:169` "WHAT–?! You dare defy Jinbei the Bandit King, the greatest highwayman that ever lived?!" | ✗ **rewritten** |

**Structure is identical** — same speakers (`<id>151</id>` Jinbei / `<id>-2</id>` player),
same beat order, **exactly two** stacked choice rows matching the two `<choice>` elements,
same reconvergence into the ambush fight. **Wording is not.**

**Consequence for the rebuild — state this honestly:** `questdata.xml` gives us the
**complete script and the exact branching graph**, and a **majority-but-not-all** of the
shipped English wording. It is a *near-verbatim* source, not a byte-verbatim one. Any
"verbatim dialogue closed" claim must be qualified: closed **structurally and substantially**;
line-level fidelity for scenes visible in the two longplays must be **read off the frames**,
which win.

**Verdict: PARTIAL · this is a NEW correction, in the opposite direction from the staleness
banner** (the banner over-claims by implying the 3,307 lines are the shipped script).

---

## Q-07 — §4 Ready "archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)" is WRONG. The engine's taxonomy is a 9-value enum and the shipped data uses 3.

**Ledger sentence (§4 Ready):** > "archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)"

**A2 — `reference/decompiled/shs3_android_payload/scripts/QuestType.as:6–24`, verbatim:**
```
      public static var NormalSideQuest:int = 0;
      public static var RepeatableSideQuest:int = 1;
      public static var StoryQuest:int = 2;
      public static var DailySideQuest:int = 3;
      public static var Dialogue:int = 4;
      public static var ClanQuest:int = 5;
      public static var OngoingQuest:int = 6;
      public static var HighLvlQuest:int = 7;
      public static var LowLvlQuest:int = 8;
      public static var length:int = 9;
```
There is **no** `trade`, `bounty`, `escort`, `gather` or `timed` type — those are content
patterns, not engine archetypes. There **are** four types the ledger never names:
`DailySideQuest`, `ClanQuest`, `HighLvlQuest`, `LowLvlQuest`.

**A2 — measured `<type>` over the 61 shipped quests:** `{2 (StoryQuest): 37, 4 (Dialogue):
22, 0 (NormalSideQuest): 2}`. Types 1/3/5/6/7/8 are engine-supported but produced at
runtime by `QuestGenerator.as`, not authored in `questdata.xml`.

**Verdict: HELD · overturns a §4 "Ready" bullet (an OVER-claim: the taxonomy we "have" is the wrong taxonomy).**

---

## Q-08 — §4 Surface "QUEST_LOG_CAP = 7 (1 story + 6 side)" is a MISREAD of a UI row count. There is no cap.

**Ledger sentence (§4 Surface):** > "QUEST_LOG_CAP = 7 (1 story + 6 side)."

**A2 — `reference/decompiled/shs3_android_payload/scripts/QuestLogUI.as:88–96`, verbatim:**
```
         this.questLogButtonList = new Vector.<QuestLogButton>();
         for(i = 0; i < 7; i++)
         {
            tempQuestLogButton = new QuestLogButton(i);
            tempQuestLogButton.x = 60;
            tempQuestLogButton.y = 73 + i * 55;
            addChild(tempQuestLogButton);
            this.questLogButtonList.push(tempQuestLogButton);
         }
```
The 7 is the number of **visible rows**, at `x=60`, `y=73+55i`. The backing list is
`activeQuests`, scrolled — `QuestLogUI.as:525` `this.maxRow = this.maxLength -
this.questLogButtonList.length;` and `:553`
`this.questScrollDownButton.visible = this.activeQuests.length - this.currentRow > length;`.
A repo-wide grep for an accept-time cap (`activeQuests.length <`, `questLimit`,
`MAX_ACTIVE`) returns **one** hit, and it is a selection-index clamp, not a cap.

**Verdict: HELD · overturns a §4 "Surface" bullet.** Ship the 7-row scroller geometry;
do **not** ship a 7-quest limit.

---

## Q-09 — the "player named Satoshi" contradiction is closed by a frame + the payload: Satoshi is a companion NPC (id 161) who fights beside you 14 times; the player's nameplate is the account name.

**Ledger sentence (§4 Surface):** > "the +3-stat and 'player named Satoshi' contradictions are already resolvable"

**A1 — `reference/videos/zFtCaTO0_1M.mp4` @ t=68 s, crop `(0,700)–(1400,1060)`:** the
speaker nameplate over the player's own choice rows reads **"GUEST"** (that longplay ran
unauthenticated). **A1 — `reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg`** (480×270,
PLAYER character sheet, full-frame read): the name field over the paperdoll reads
**"SOUND360TM"** — the uploader's account handle. The player character has **no fixed
canonical name**.

**A2 — `reference/extracted/questdata.xml`:** the player speaks as `<id>-2</id>`
(`:158`), never as a portrait; `satoshi` / `satoshi_serious` / `satoshi_happy` appear as
`<img>` portrait tokens **406 times**; and Satoshi is NPC **id 161**, resolving via
`docs/gauntlet/L0/index/resolved_names.json` to `"Satoshi"`, appearing **14 times** as a
`<wave><friend>` — a fighting ally.

**Verdict: HELD · the ledger's "resolvable" is now RESOLVED.**

---

## Q-10 — §4 Ready "9 reward tuples" undercounts by ~8.5×; "character roster + roles" undercounts by ~3×.

**Ledger sentence (§4 Ready):** > "turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles"

**A2 — measured:** 77 `<reward>` blocks (69 `<exp>` + 18 `<loot>` rows), not 9.
**A2 — 68 distinct `<img>` portrait tokens**, i.e. the cast *with expression variants*:
`kojuro` (213 uses), `yuudai` (210), `satoshi_serious` (209), `fumio` (177), `satoshi`
(176), `chikako_mask` (77), `hiroshi` (65), `hachimaru` (65), `mitsuo` (52),
`fumio_happy` (52), … plus dramatic states `mitsuo_dying`, `yasuka_hurt`, `jinbei_angry`,
`chikako_blush`, `magoichi_masked`, `yuudai_before`, `takamori_stand`. The art *manifest*
for the story mode is fully enumerated.

**Verdict: HELD (under-claim, both bullets).**

---

## Q-11 — an entire quest subsystem is missing from the §4 block: scripted ALLIES in quest waves.

The §4 quests-story block never mentions allies, and `enemies-ai` §4 says only
"independent-aggro (no coordination)". **A2 — `reference/extracted/questdata.xml`** holds
**70 `<wave><friend>` entries** with `<id>/<qty>/<lvl>/<x>/<fatal>`, resolving to:
Fumio ×16, Yuudai ×15, **Satoshi ×14**, Old Guard ×6, Soldier(807) ×4, Soldier(806) ×4,
Mitsuo ×3, Hachimaru ×3, Shou ×3, Hiroshi ×1, Chikako ×1 — and 59 of the 70 carry
`<fatal>0</fatal>` (allies are knock-down-not-death). There are also 2 `<neutral>`
combatants (`<id>118</id>` = *Training Dummy*).

The same waves table gives the per-quest enemy roster: **151 `<enemy>` rows**, `<lvl>` 2–35,
`<qty>` 1–10, spawn `<x>` −400…2000, 4 `<endless>1</endless>` survival-style waves, and
16 `<fatal>` flags — e.g. Undead ×24, Jinbei ×3, Inokichi, Tadao, Aboshi, Bounty Hunter 1/2,
Mad Cultist, Guardian.

**Verdict: HELD (new system, unlisted in the ledger).**

---

## Q-12 — the cutscene director is fully recovered: 55 cutscenes / 399 commands / a closed 15-verb instruction set.

The §4 Ready bullet says only "turn-in modal chain". **A2 — measured over
`reference/extracted/questdata.xml`:** 55 `<cutscene>` blocks, 399 `<data>` commands,
each `<time>` (0–8 s) + `<id>` (actor handle, e.g. `fig1`) + `<action>` + `<param>` + `<x>`
(−200…1600). The `<action>` verb domain is **closed and complete**:

`anim` 107 · `walk` 76 · `create` 75 · `end` 33 · `sound` 23 · `say` 16 ·
`createprojectile` 16 · `face` 13 · `remove` 10 · `addemitter` 7 · `removeemitter` 7 ·
`pose` 6 · `darkblur` 6 · `setposition` 3 · `createobject` 1

**A2 quote — `questdata.xml:27414–27420` (Epilogue cutscene, first command):**
```
        <data>
          <time>0</time>
          <id>fig1</id>
          <action>create</action>
          <param>814,shoulderweapon,1</param>
          <x>220</x>
        </data>
```
Note `sound` (23 uses) — cutscene audio **cue points** are held even though the audio
blobs themselves are encrypted (S0-5). And `addemitter`/`removeemitter` name a particle
system the art-anim lane lists as an open FX blocker.

**Verdict: HELD (under-claim).**

---

## Q-13 — "two Yasukas = one person" holds, now with a payload cite instead of inference.

**Ledger sentence (§4 Ready):** > "the 'two Yasukas' = one person (closed)"

**A2 — `docs/gauntlet/L0/index/resolved_names.json` → `npcdata.xml`:** exactly **one**
NPC resolves to the name "Yasuka", id **156**. `questdata.xml` uses portrait tokens
`yasuka` (41) and `yasuka_hurt` (10) — one character, two emotional states.

**Verdict: HELD (confirms the ledger).**

---

## Q-14 — STILL_UNHELD: the semantics of `<step><action>` (the trigger-type enum).

I measured the domain (`{0,1,4,6,14}`, 215 rows) and found `QuestAction.as:49`
`this.action = stepData.action;`, but I did **not** find the enum that maps those ints to
behaviours ("talk to", "kill", "gather", "enter room"). Without it, per-step trigger
*types* are enumerated but not *named*.

**Verdict: STILL_UNHELD.** Close-path: trace `QuestAction.action` consumers in
`InteractUI.as` / `GenericActionButton.as` / `Obj_NPC.as` in
`reference/decompiled/shs3_android_payload/scripts/`. Cheap; one focused pass.

---

## Q-15 — STILL_UNHELD: `<outcome><id>` global-variable semantics (the quest flag namespace).

194 `<outcome><set>` rows write to 28 distinct `<outcome><id>` values (42…40002) — e.g.
`questdata.xml:34–36` `<id>40000</id><set>1</set>`. These are the save-game story flags,
and `startcondition/has/id` reads them back (`:9` `<id>40000</id>`). I did **not** open
`XMLQuestOutcome.as` / `StatsManager.checkConditions` to establish whether id-space
40000+ is "story flags", 20000+ "quest items", <1000 "stats". Guessing that mapping would
be a fabricated cite.

**Verdict: STILL_UNHELD.** Close-path: read `XMLQuestOutcome.as` +
`StatsManager.checkConditions` in the same bundle.

---

## Re-score recommendation for §2: **quests-story 42 → 78**

Justification, additive: script + branching graph held (Q-01), all 14 chapters held (Q-02),
triggers/coords/rewards tabled and name-resolved (Q-03), the choice-consequence question
answered rather than open (Q-04), no Android caveat (Q-05), cutscene director held (Q-12),
ally/enemy wave tables held (Q-11). Held back from >85 by three real gaps: the **wording
divergence** between payload and shipped build (Q-06 — the frame wins, and it costs us
line-level fidelity for every scene we cannot see on video), and two unnamed enums
(Q-14, Q-15). Not a 100: `<img>` portrait *art* and `<bg>` backdrops are referenced by
token, and the art itself is a separate recovery problem.
