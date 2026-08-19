# LENS 3 — PRECEDENCE CRITIC · unit `quests-story`

**Run:** 2026-08-17 · blind critic, saw only the surveyor's output JSON.
**Lens:** stale-claiming — does a claim import a doc/code statement that a later
measurement, ruling, or **frame** overturned? Citing code or a doc second-hand where a
frame settles it is REFUTED under §0.
**Every verdict below carries an artifact I opened myself.** Commands were re-run; nothing
was accepted on the surveyor's word.

---

## HEADLINE — the lens fired, and it fired on the biggest claim in the set

The surveyor's Q-01 and Q-05 rest on a premise nobody checked: that
`reference/extracted/questdata.xml` **is the web build's quest data**. It is not, and the
shipped web build does not carry quest data at all.

**Three independent artifacts, all opened this run:**

1. **The web v0.717 payload has 27 `DefineBinaryData` blobs and not one is quest data.**
   ```
   $ grep -c "binaryData\|DefineBinaryData" reference/extracted/payload.xml
   27
   ```
   Heading all 27 files in `reference/extracted/bindata/`: 19 × `<animdata>`, 1 ×
   `<survivalmodedata>` (119), 1 × room-object XML (93), 5 × name-generator word lists
   (94–98), 1 × `GIF89a` (92). Corroborated by `docs/gauntlet/L0/index/bindata.json`.
   The Android bundle by contrast has **42** blobs — the 15 extra are precisely the
   `Mobile_*` data tables, `116_Mobile_QuestData.bin` among them
   (`reference/decompiled/shs3_android_payload/scripts/Mobile_QuestData.as:5`
   `[Embed(source="/_assets/116_Mobile_QuestData.bin", …)]`).

2. **The web build downloads its quest script over the network.**
   `reference/decompiled/shs3_payload/scripts/§1t1524s0§.as` (obfuscated, web v0.717 —
   version pinned at `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36`
   `public static var §1t9323s0§:Number = 0.717;`) loads **every** data XML through
   `URLLoader` → `§1t3318s0§.instance.§1t3331s0§(…)` at lines 330, 357, 388, 420, 453,
   479, 505, 528, 554, 580, 606, 632, 658. The class-named twin says what that is:
   ```
   reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:281-291
   public static function loadExternalQuestDataXML() : void {
      var myLoader:URLLoader = new URLLoader();
      if(StatsManager.useLocalXML) { myLoader.load(new URLRequest(xmlURL + "questdata.xml")); }
      else { myLoader.load(new URLRequest(QueryManagerPIO.instance.getDataXML("questdata.xml"))); }
   ```
   The embedded-blob path (`QuestEngine.loadQuestData(XML(new QuestData()))`) exists only
   in the mobile branch, `reference/decompiled/shs3_android_payload/scripts/Mobile.as:438-440`.

3. **The string proves it.** `"Jinbei the Bandit King"` occurs in exactly two files under
   `reference/`: `extracted/questdata.xml` and `extracted/android/116_Mobile_QuestData.bin`.
   Zero hits in `reference/decrypted/` (UTF-8 **and** UTF-16LE scanned), zero in
   `reference/decompiled/` (`grep -rl "Jinbei"` → nothing).

**Consequence.** The corpus we hold is the **Android v0.682 embed**. Q-05's byte check does
not retire the Android caveat — it *proves the caveat applies*, because both sides of the
comparison are the same Android-lineage file. And the ledger line the surveyor claims to
have killed, `REBUILD_READINESS.md:347` — *"if the story is server-fetched and the server is
dead, the actual script is gone"* — turns out to have named the exact mechanism. Its
antecedent is TRUE for the shipped build. What is dead is only its conclusion: a *snapshot*
survives, because Android bundled one.

This is also the missing **why** behind the surveyor's own Q-06. I re-extracted those frames
and Q-06 is correct on its facts; the reason the shipped Prologue is reworded is that the
web build fetched a **newer** `questdata.xml` from the CDN than the one Android froze.
**THE FRAME WINS, and now the code says why it wins.**

---

## Per-claim verdicts

### Q-01 `verbatim-script-held` — **REFUTED (fatal, in part)**
*Own cite:* `reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:330-658` ·
`reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:281-291` ·
`grep -c binaryData reference/extracted/payload.xml` → **27**, none quest.

What survives: 2,771 `<dialogue>` / 3,307 `<text>` are real — I re-counted both, and
`LangManager.as:95-100` does return non-`ID` strings unchanged, verified verbatim. Line 128
is exactly as quoted.

What dies: **"NOT server-fetched … sit as static XML in the client payload"** and **"those
lines are what the game renders."** In the *web* build the script is fetched from
Player.IO at runtime, and the frame shows the fetched revision differs. The claim also
leans on a **v0.682** code path (`shs3_android_payload/LangManager.as`) to assert what the
**v0.717** build renders — the surveyor's own Q-05 lane note forbids exactly that.
Correct wording: *"a near-final Android-lineage snapshot of the script is held; the shipped
web build fetched a later revision."*

### Q-02 `ep4-12-epilogue-shipped` — **HOLDS**
*Own cite:* `reference/extracted/questdata.xml:8521, :24869, :27347, :27697, :27710, :27726`
— all six read; every line matches the quote character-for-character.
The ledger's *"Ep4–12 were likely never shipped"* is genuinely disproven.
Note to carry forward: this proves 14 chapters exist in the **v0.682-era** data; label them
accordingly rather than as "the shipped campaign".

### Q-03 `triggers-coords-rewards-tabled` — **REFUTED (minor)**
*Own cite:* ElementTree path census of `reference/extracted/questdata.xml`.
Verified exactly: `step` 225 · `node` 225 · `roomobj` 225 · `step/action` 215 ·
`roomobj/property/obj/x` **348** · `roomobj/x` **52** · `teleportposx` **14** ·
`wave/enemy/x` **97** · `reward` 77 · `reward/exp` 69 · exp domain exactly
{100,200,250,290,500,600,750,1000,2000,3000}. Loot ids resolve
(`13100`→"Iron Sword", `2103`→"Small Rice Ball" via `resolved_names.json`).
**Wrong:** `<loot>` is **19**, not 18 (`questdata/quest/step/reward/loot` = 19).
Two of the 19 are not plain items — `<id>0</id><qty>30</qty>` (coins) and
`<id>13022,82@1#</id>` (an item id with an inline modifier suffix), which a generator built
from the surveyor's table would mis-handle.

### Q-04 `choices-not-consequential` — **REFUTED (material)**
*Own cite:* `reference/extracted/questdata.xml:814-882` +
`reference/decompiled/shs3_android_payload/scripts/XMLQuestStep.as` `getXMLIntroList()` +
`XMLQuestOutcome.as` `applyOutcome()`.

The *measurements* hold — I confirmed 471 `<choice>`, **0** with `<outcome>`, 7 with
`<condition>`, 0 `<gotolabel>`. The *conclusion* does not. Consequence is not carried on
the choice; it is carried by **where the choice jumps**. `<goto>` is an index into the
flattened display list, so a choice can land before or after a state-writing `<outcome>`:

```
814  <option>
816    <choice><text>What's his story?</text><goto>10</goto></choice>
820    <choice><text>(FIghting Tutorial) I may be able to learn something here.</text><goto>14</goto></choice>
824    <choice><text>I should go.</text><goto>19</goto> … </choice>
…
860    <outcome><id>113</id><set>8402944</set><end>0</end></outcome>
865    <outcome><id>114</id><set>4</set><end>0</end></outcome>
870    <outcome><id>102</id><set>0</set><end>1</end></outcome>
875    <dialogue><id>-2</id><text>I'll leave you to your business.</text></dialogue>
879    <outcome><modify>0</modify><end>1</end></outcome>
```
Choosing the tutorial line writes **three** StatsManager values; choosing "I should go."
writes none. I simulated every option in the file against the real interpreter semantics
(`XMLQuestStep.getXMLIntroList` + `CutsceneManager.display`): **55 of 196 options have
choices whose branches differ in the state they write or in how the scene terminates
(`leaveOK` vs `leaveCancel`).** Examples: Prologue step 9 "Let's start mining." sets
113/114/115/102 while "Not right now." sets nothing; Prologue step 14 "Bah! I know where
I'm not wanted." sets 110=12 while the sibling branch does not; Fighting Tutorial step 3
sets 30017=3 on one branch only.

"The choice graph is a flat jump table, not a consequence system" would build the campaign
wrong, and the lane guidance to *drop* L1's runtime risk is the dangerous half.

### Q-05 `android-caveat-retired` — **REFUTED (fatal)**
*Own cite:* `grep -c binaryData reference/extracted/payload.xml` → 27 (none quest; all 27
headed by hand) · `reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:330-658` ·
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36` (`0.717`).

The byte check itself reproduces exactly — android 796,384 B, web 796,383 B, sha256 of both
`e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e`. The **inference** is
inverted. There is no "web questdata.xml": the web payload ships no quest blob and fetches
the file at runtime, so the comparison is Android-lineage data against Android-lineage data
and establishes nothing about v0.717. Worse, the surveyor's own Q-06 frame proves the
shipped text differs — so the caveat this claim retires is the one the frame confirms.
Textbook precedence failure: **a byte check used to overrule a frame.** THE FRAME WINS.
Also a non-sequitur inside the claim: identical *data* would not licence porting *code*
("53 named quest classes") — its own `lane_impact` concedes this and contradicts the text.

### Q-06 `frame-beats-payload-dialogue-rewritten` — **HOLDS (independently reproduced)**
*Own cite:* `reference/videos/zFtCaTO0_1M.mp4` (1920×1080, 4185 s), frames pulled at
t=62/68/72/76 s, crop `crop=1400:360:0:700` (bottom parchment box + nameplate tab),
written to
`/private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad/prec/crop{62,68,72,76}.png`.

Read off my own crops:
* t=62, nameplate **JINBEI** — "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE
  BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY." ≠ `questdata.xml:128`.
* t=68, nameplate **GUEST**, two stacked rows — "I'LL STAND MY GROUND AND ASK THEM TO LEAVE
  ME ALONE." (**exact** = `:149`) / "THESE BANDITS DON'T SCARE ME!" (≠ `:153`).
* t=72 — "HOW ABOUT I HAND OVER HALF THE LENGTH OF THIS SWORD -- SHARP END FIRST. WILL …
  SUFFICE AS PAYMENT?" (`:183` prefixes "I say ").
* t=76, **JINBEI** — "THAT'S TOO BAD, TRAVELER. IT REALLY IS…" ≠ `:169`.

Structure matches perfectly (speakers, beat order, two choice rows, reconvergence). This is
the strongest claim in the set and the surveyor was right to lead with the frame. It should
have been allowed to overrule Q-01 and Q-05, which it flatly contradicts.

### Q-07 `questtype-taxonomy-wrong` — **HOLDS**
*Own cite:* `reference/decompiled/shs3_android_payload/scripts/QuestType.as:6-24` (read; the
9 constants are exactly as quoted) + measured `<type>` over the 61 quests → `{2:37, 4:22, 0:2}`.

### Q-08 `quest-log-cap-is-a-row-count` — **HOLDS, and is stronger than cited**
*Own cite:* `reference/decompiled/shs3_payload/scripts/§1t6472s0§.as:96-106` — the **web
v0.717** payload, not the mobile one:
```
 96  this.§1t6803s0§ = new Vector.<§1t6782s0§>();
 98  while(_loc2_ < 7)
101     _loc1_.x = 60;
102     _loc1_.y = 73 + _loc2_ * 55;
```
(identified as the quest log by the `abandonbutton` / `teleportbutton` / `completebutton`
setters at :110-112). `QuestLogUI.as:521-534, :553` confirm the unbounded `activeQuests`
list and the scroll gate. The claim cited only the Android class for geometry that L8 will
ship on screen; that is the pattern this lens exists to catch, but here the number happens
to be identical in the web build, so it survives. **Cite the web class, not the mobile one.**

### Q-09 `player-name-satoshi-resolved` — **REFUTED (minor)**
*Own cite:* my own t=68 crop (nameplate reads **GUEST**) + `reference/frames/broad_survey/
Nr4fQstqHDM_0090.jpg` upscaled 480×270 → 1920×1080 lanczos: the PLAYER sheet reads
**SOUND360TM** over the paperdoll, beside COINS 425 / GOLD 2 / EXPERIENCE POINTS / AVAILABLE
STAT POINTS: 0. `questdata.xml:158` `<id>-2</id>` verified; npc 161 = "Satoshi" verified.
Substance is right. **Wrong number:** `satoshi*` `<img>` tokens total **411**, not 406 —
`satoshi` 176 + `satoshi_serious` 209 + `satoshi_happy` 21 + `satoshi_drunk` 5. The
surveyor missed `satoshi_drunk`.

### Q-10 `reward-and-roster-undercount` — **REFUTED (material)**
*Own cite:* `<img>` census by parent element over `reference/extracted/questdata.xml`.
77 `<reward>` / 69 `<exp>` / 68 distinct `<img>` all reproduce. But **"68 distinct `<img>`
portrait tokens … a closed 68-asset portrait manifest"** conflates two different asset
classes and two different render paths:

| where | count | distinct | engine path |
|---|---:|---:|---|
| `<dialogue><img>` — speaker portrait | 1,902 | **52** | `questDialogueUI.show(id, text, portrait)` |
| `<intro><img>` — full-screen plate | 16 | **16** | `case "img": XMLQuestImage` → `questImageUI.show()` |

The 16 intro-level tokens are `_episode0`…`_episode12`, `_epilogue`, `_exposition`,
`_exposition_epilogue` — chapter cards, not characters. One of the 52 is `noportrait`, a
null sentinel. **The character-portrait manifest is 51, not 68.** Handing L6 "68 portraits"
would have it draw 17 things that are not people.
Also inherits the `<loot>` 18-vs-**19** miscount.

### Q-11 `ally-waves-unlisted-system` — **HOLDS**
*Own cite:* measured over `reference/extracted/questdata.xml` + `resolved_names.json`.
Friend ids reproduce **exactly**: 164 Fumio ×16 · 168 Yuudai ×15 · 161 Satoshi ×14 ·
90 Old Guard ×6 · 807 Soldier ×4 · 806 Soldier ×4 · 197 Mitsuo ×3 · 181 Hachimaru ×3 ·
182 Shou ×3 · 144 Hiroshi ×1 · 811 Chikako ×1 = 70. `<fatal>` present on 59, all `0`.
`wave/neutral` 2, id 118 = "Training Dummy". `wave/endless` 4. `wave/enemy` 151.
Two completeness notes (not refutations): a further **18** `<enemy>` rows live at
`step/roomobj/property/obj/property/xml/wave/enemy` (169 total), and only 142/151 carry
`<lvl>` and 97/151 carry `<x>`, so the quoted lvl/x ranges describe a subset.

### Q-12 `cutscene-director-held` — **HOLDS**
*Own cite:* `reference/extracted/questdata.xml:27414-27420` read (matches the quote exactly)
+ verb histogram over all 399 `<cutscene><data>` — reproduces to the last count:
anim 107 · walk 76 · create 75 · end 33 · sound 23 · say 16 · createprojectile 16 · face 13 ·
remove 10 · addemitter 7 · removeemitter 7 · pose 6 · darkblur 6 · setposition 3 ·
createobject 1.

### Q-13 `two-yasukas-confirmed` — **HOLDS**
*Own cite:* `docs/gauntlet/L0/index/resolved_names.json` → npc `156` "Yasuka" is the only
name match; `questdata.xml` portrait tokens `yasuka` 41 / `yasuka_hurt` 10.
⚠ The same test the surveyor ran on Yasuka fails on **Chikako**: npc **171** and npc **811**
both resolve to "Chikako" (171 speaks the dialogue, 811 is the `<wave><friend>` combatant) —
and both were used inside the surveyor's own Q-11 without comment. See NEW-7.

### Q-14 `step-action-enum-semantics` — **HOLDS as an honest STILL_UNHELD** (now closed, see NEW-3)
*Own cite:* `reference/decompiled/shs3_android_payload/scripts/QuestAction.as:49` — it does
only `this.action = stepData.action`, carrying the int through. The measured domain
reproduces: `{0:169, 1:37, 6:5, 14:3, 4:1}` = 215 rows (10 further steps carry no
`<action>`). Refusing to guess was correct. I closed it below.

### Q-15 `outcome-id-namespace` — **REFUTED (minor — the verdict is right, the numbers are not)**
*Own cite:* census of every `<outcome>` in `reference/extracted/questdata.xml`.
`<set>` rows: 194 ✓ — but **25** distinct ids, not 28, spanning **43…40002**, not "42…".
Id **42** never appears under `<set>` at all; it appears only under `<modify>` (3 rows).
Declining to name the namespace was honest, but the close-path was one file away — see NEW-4.

---

## NEW FINDINGS the surveyor missed

**NEW-1 · The web build fetches the quest script; only Android embeds it. (A2, fatal to Q-01/Q-05)**
See HEADLINE. Restores the antecedent of `REBUILD_READINESS.md:347` and supplies the
mechanism behind Q-06's frame divergence.
*Lane:* L1 must label the whole corpus **v0.682-era Android embed**, and treat every scene
visible in the two longplays as the authority over the file.

**NEW-2 · `<goto>` semantics are fully determined. (A2)**
`XMLQuestStep.getXMLIntroList()` pushes one entry per intro child, and for `<option>` pushes
the option **plus one `null` slot per `<choice>`**; `<choice>` itself pushes nothing.
`CutsceneManager.gotoStep` then sets `currentDisplayNo = goto` directly. Verified against
`questdata.xml:8722-8808`, where goto 11/20/22/24/26/28 all land on exactly the right line
under that rule and on nothing sensible without it. A `null` slot traces and falls through
to `nextStep()` (`CutsceneManager.display():174-179`).
*Lane:* L1 can now build the interpreter exactly; without this rule every branch lands wrong.

**NEW-3 · `<step><action>` is `GameEngine.ACTION_*`. Q-14 is CLOSED. (A2)**
`reference/decompiled/shs3_android_payload/scripts/GameEngine.as:81-109`:
`0 ACTION_NOTHING · 1 ACTION_FIGHT · 2 ACTION_ASSASSINATE · 3 ACTION_ESCORT ·
4 ACTION_SURVIVE · 5 ACTION_REACHMARKER · 6 ACTION_DUEL · 7 ACTION_ADVENTURE ·
8 ACTION_HARVEST · 9 ACTION_SURVIVALMODE · 10 ACTION_WARROOMBATTLE · 11 ACTION_PLAYBACK ·
12 ACTION_PVPROOM · 13 ACTION_CUTSCENE · 14 ACTION_SURVIVECLEANUP`.
The step field is passed straight in: `QuestEngine.as:1218`
`GameEngine.initBattleMode(quest, questStepData.action, questStepData.bg, …)`, and
`Overworld.as:258` gates spawning on `questStepInfo.action > 0 && wave.length > 0`.
So the shipped 215 steps are **169 ACTION_NOTHING (talk/interact/travel) · 37 FIGHT ·
5 DUEL · 3 SURVIVECLEANUP · 1 SURVIVE**. Duel steps additionally start the player at
x=150 instead of 400 (`QuestEngine.as:1214-1217`).

**NEW-4 · `<outcome><id>` is the StatsManager stat/flag id space. Q-15 is mostly CLOSED. (A2)**
`XMLQuestOutcome.applyOutcome()` dispatches on the id: `id == 11` → `addLootCoins`;
`2000 <= id < 30000` → `addLootItemBasic` (real item ids); `id == STAT_XP` → `addLootXP`;
otherwise `StatsManager.changeStat` / `setStat`. `StatsManager.as:170-260` names the low
range — including `STAT_LOCATION_ROOM = 43` (the most-used `<set>` id after the 100-block)
and **`STAT_CHIKAKOLOVE = 42`**, an affinity meter that quest outcomes `<modify>` three times.
Ids 100–130 sit above the stat table and behave as story flags; 30017 / 40000 / 40002 sit
above that again.
*Lane:* the save-game's story section is `StatsManager`'s stat map; L1 + L9 can schema it now.

**NEW-5 · The romance/affinity meter is a named, quest-driven stat. (A2)**
`STAT_CHIKAKOLOVE` (`StatsManager.as:246`), written by `questdata.xml:8776, :8785, :8794`.
Appears in no ledger system block.

**NEW-6 · The `<img>` manifest is two asset classes, 51 portraits + 16 chapter plates.** See Q-10.

**NEW-7 · "One name ⇒ one NPC row" fails, and one portrait token is a typo. (A2)**
npc **171** and npc **811** both resolve to "Chikako"; `806` and `807` both to "Soldier".
And the portrait token list contains **`chikako_maked`** (1 use) alongside `chikako_mask`
(77) — a misspelling in the shipped data. L6 must ship the typo'd token or that one node
renders portrait-less.

**NEW-8 · Four `<choice>` rows carry no `<text>`.** 467 of 471 have one
(`intro/option/choice/text` 465 + `ending/option/choice/text` 2). The UI must tolerate a
blank row — the Fighting/Mining Tutorial options are among them.

---

## Scoring note

The surveyor's **78** is over-stated. Q-01 and Q-05 are the two claims doing the most work
in the rationale ("the dialogue corpus is an input, not a writing task"; "the Android-version
caveat is retired by a byte check"), and both invert under artifacts the surveyor could have
opened. Q-04's conclusion would mis-build the quest state machine and Q-10 would mis-brief
the art lane. Netting the two genuine closures I contributed (NEW-3, NEW-4) against four
refutations, this unit reads closer to **60-65**: the *script snapshot* is a real and large
win, but it is a v0.682 snapshot of a **server-delivered** file, and that is a different —
and materially weaker — thing than "the verbatim shipped script is held".
