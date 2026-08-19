# quests-story — CITE LENS review (blind critic, run 3)

**Reviewer stance:** every cite below was opened by me. Where I say REFUTED I paste the artifact
I opened, not the surveyor's. Nothing here is reasoned from memory of the game.

---

## HEADLINE — the provenance of `reference/extracted/questdata.xml` is mis-labelled, run-wide

The surveyor (claim `android-caveat-retired`) asserts that `reference/extracted/questdata.xml`
is **the web build's** quest data and that it is byte-identical to the Android blob, therefore the
v0.682-vs-v0.717 caveat "does not apply to quests-story".

The byte-check reproduces exactly. The **label does not**.

I inflated both decoded payload SWFs and counted the data roots directly:

```
$ python3 - <<'EOF'
import zlib
for f in ['reference/decrypted/shs3_payload_decoded.swf',
          'reference/decrypted/shs3_android_payload_decoded.swf']:
    d=open(f,'rb').read(); b=d[:8]+zlib.decompress(d[8:])
    print(f, len(b), {t: b.count(t) for t in
        [b'<questdata>',b'<quest>',b'<itemdata>',b'<npcdata>',b'<skilldata>',
         b'A new face in this territory']})
EOF
reference/decrypted/shs3_payload_decoded.swf          11892061
   {b'<questdata>': 0, b'<quest>': 0, b'<itemdata>': 0, b'<npcdata>': 0,
    b'<skilldata>': 0, b'A new face in this territory': 0}
reference/decrypted/shs3_android_payload_decoded.swf  21688592
   {b'<questdata>': 1, b'<quest>': 61, b'<itemdata>': 1, b'<npcdata>': 1,
    b'<skilldata>': 1, b'A new face in this territory': 1}
```

The scan is valid because the **web** payload stores its DefineBinaryData blobs as *raw,
uncompressed* XML — proved by taking a known web blob and finding its literal bytes inside the
inflated web SWF:

```
bindata/119_1t4646s0.bin  ->  b'<?xml version="1.0" encoding="UTF-8"?>\r\n<survivalmodedata>...'
raw first 200 bytes present in inflated web SWF ?  True
inflated web SWF: <survivalmodedata> x1, <animdata> x19     (the 27 known web blobs)
```

So the web payload really does ship anim/survival/room-object/name-generator blobs and **no
quest, item, npc or skill XML at all**. Corroborated by mtime ordering: `questdata.xml`,
`itemdata.xml`, `npcdata.xml`, `skilldata.xml` were all written **Jul 25 18:27**, while
`reference/decrypted/shs3_payload_decoded.swf` (the web payload) did not exist until
**Jul 25 18:33** — the Android payload was decoded at 17:38 and decompiled at 17:51.

**Consequence:** `reference/extracted/questdata.xml` is **ANDROID-derived (v0.682)**. Every
measurement in this unit is a measurement of the *mobile* campaign. The standing Android caveat
does not merely apply here — this unit is *entirely* Android-sourced, and the surveyor's own A1
claim (`frame-beats-payload-dialogue-rewritten`) is the visible symptom: the shipped web build
renders different words because it is running a different script source. **THE FRAME WINS, and
now we know why it wins.**

This is cross-cutting. Any other unit that has called `itemdata.xml` / `npcdata.xml` /
`skilldata.xml` "the web payload's data" carries the same mislabel.

---

## Verdicts

### 1. `verbatim-script-held` — **REFUTED (material)**
Cite resolves perfectly. `questdata.xml:128` is verbatim the quoted line; `LangManager.as:95-100`
is verbatim `public static function getQuestString(id:String)` / `if(id.charAt(0) != "I" ||
id.charAt(1) != "D") { return id; }`.

What is wrong is the inference. The claim says the lines "sit as static XML in **the** client
payload … **so those lines are what the game renders**." For the build in the longplays they are
not: the inflated web payload holds **zero** `<quest>` elements and zero of that text (above), and
five frames I re-extracted show the rendered Prologue using different wording. The ledger's
conditional — *"if the story is server-fetched … the actual script is gone"* — is closer to true
for the web build than the claim allows.

**Survives:** a complete 2,771-block / 3,307-line script corpus IS held, on disk, un-gated by the
string table. That is a real and large win — it is just the **Android v0.682 script**, and it is
not proven to be what the web build rendered.

### 2. `ep4-12-epilogue-shipped` — **HELD**
All six line numbers land exactly on the quoted text (`:8521` Episode 4, `:24869` Episode 12,
`:27347` Epilogue, `:27697` Season 2, `:27710` "(Unreleased) The adventure continues…",
`:27726` the "not yet released" string). Full chapter list confirmed: Prologue(:5) → Ep1–Ep12 →
Epilogue → Season 2 stub = 14 shipped chapters. Ledger text verified verbatim at
`REBUILD_READINESS.md:166-167`. **Caveat to carry:** "ship" here means *ship in the Android
bundle*; the web build's chapter count is unestablished (see HEADLINE).

### 3. `triggers-coords-rewards-tabled` — **HELD, one count wrong (minor)**
Reproduced by ElementTree parent-path histogram:
`quest/step` 225 · `step/node` 225 · `step/roomobj` 225 · `step/action` 215 (domain
`{0:169, 1:37, 6:5, 14:3, 4:1}`, closed at 5) · `roomobj/property/obj/x` 348 · `roomobj/x` 52 ·
`teleportposx` 14 · `wave/enemy/x` 97 · `step/reward` 77 · `reward/exp` 69 (closed 10-value domain
{100,200,250,290,500,600,750,1000,2000,3000}). `13100` → "Iron Sword", `2103` → "Small Rice Ball"
resolve in `resolved_names.json`.

**Wrong:** `<loot>` is **19**, not 18 — `grep -c "<loot>" reference/extracted/questdata.xml` → `19`,
at lines 443, 448, 453, 761, 897, 1036, 1498, 2553, 2602, 3889, 4047, 4164, 4169, 4174, 8372,
14013, 14018, 14580, 16139. The surveyor's own cited range `:442-456` in fact contains **three**
loot rows and its quote shows only two (it stops one line short of `</loot>` on the third,
`<id>20108</id>` = "Crane Feather").

### 4. `choices-not-consequential` — **REFUTED (material)**
The measurement is right and I reproduced it exactly over all 471 `<choice>` blocks:
`goto` 471/471 · `outcome` **0**/471 · `condition` 7/471 · `gotolabel` 0/471. `XMLQuestChoice.as`
is 49 lines and `applyOutcome()` is verbatim at :38-47.

The **conclusion** does not follow. `<outcome>` in this schema is *positional*, not nested — it is
a sibling in the `<intro>` child list, reached by falling through from a `<goto>` target. So
"no nested `<outcome>`" says nothing about consequence. Two things I measured:

* 25 of the 99 `<option>`-bearing `<intro>` blocks carry **≥2 `<outcome>` blocks that write `<set>`**,
  interleaved with the options and `<goto>` reconvergence points — a shape that is not "a flat
  jump table".
* The `<goto>` index model needed to actually decide the question is **unresolved**. I tested every
  constant offset into the `<intro>` child list: the best (−4) still leaves **44 of 469** gotos
  out of range (offset 0 → 123 out of range). Without a settled target model, nobody can compute
  branch divergence.

**Survives:** the Prologue toll choice specifically IS cosmetic — both branches land on
`<label>label2</label>` and the same `<outcome><id>111</id><set>5</set>`, and I watched both the
choice rows (t=68) and the "sword" reply (t=72) in the video reach the same Jinbei-attacks beat.
The honest verdict for blocker ④ is PARTIAL, not "answered, no".

### 5. `android-caveat-retired` — **REFUTED (fatal)**
The byte-check reproduces to the character:
`web len 796383 · android len 796384 · android[:-1]==web True · last byte b'\n'` ·
`sha256 e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e` both sides.

But the file it calls "the web questdata.xml" is not from the web build (HEADLINE). The web
payload contains **no quest XML whatsoever**, so what the check actually demonstrates is that
`reference/extracted/questdata.xml` *is* the Android blob. The claim is circular and its
conclusion is inverted: the Android caveat applies to this unit **maximally**, not "not at all",
and the surveyor's own frame claim is the proof.

### 6. `frame-beats-payload-dialogue-rewritten` — **HELD (PARTIAL as stated)**
I re-extracted `reference/videos/zFtCaTO0_1M.mp4` at t=62/66/68/72/76 (1920×1080), cropped the
dialogue plate and read it myself. Crop used: `crop=1920:300:0:730` (the surveyor's stated
1400-px-wide crop clips the first line — widen it). Verbatim on screen:

| t | nameplate | on screen | payload |
|---|---|---|---|
| 62 | JINBEI | "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY." | :128 "Ah! A new face in this territory!…" — **different** |
| 66 | JINBEI | "BUT I'LL TELL YOU WHAT, BECAUSE WE'RE SUCH A FRIENDLY BUNCH, ME AND MY FRIENDS WILL ESCORT YOU TO THE NEAREST TOWN, AND ALL IT'LL COST YOU IS HALF OF WHAT YOU'RE CARRYING." | :138 "If you want, I can guarantee you safe passage…" — **different** |
| 68 | GUEST | row 1 "I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE." / row 2 "THESE BANDITS DON'T SCARE ME!" | :149 **exact** / :153 "They'll get nothing from me!" — **different** |
| 72 | GUEST | "HOW ABOUT I HAND OVER HALF THE LENGTH OF THIS SWORD -- SHARP END FIRST. WILL THAT SUFFICE AS PAYMENT?" | :183 same minus the leading "I say " — **near-exact** |
| 76 | JINBEI | "THAT'S TOO BAD, TRAVELER. IT REALLY IS…" | :169 "WHAT–?! You dare defy Jinbei the Bandit King…" — **different** |

Every quoted string is confirmed. I also searched the entire `reference/` tree for the *shipped*
wording — `grep -rli "often we meet a new face" reference/` returns **nothing**. The web build's
words are held nowhere but the videos. **THE FRAME WINS, and the mechanism is now known: the
payload we hold is the Android script.**

### 7. `questtype-taxonomy-wrong` — **REFUTED (material)**
`QuestType.as` is 31 lines and :6-24 is verbatim the quoted 9-constant enum; the shipped
distribution is exactly `{2:37, 4:22, 0:2}`. Both sub-facts hold.

The claim's thesis does not. Calling the ledger's `trade / bounty / escort / gather` archetypes
"the wrong taxonomy" and (in lane_impact) "the invented 7" is contradicted by an artifact in the
same folder:

```
reference/decompiled/shs3_android_payload/scripts/QuestItem.as
26: public static var QUEST_KILLWILDLIFE:int = 0;   38: QUEST_SUMMONONI:int = 6;
28: QUEST_KILLBANDIT:int = 1;                       48: QUEST_DUEL:int = 11;
34: QUEST_GIVEWEAPONS:int = 4;                      50: QUEST_GUIDE:int = 12;   <- escort
36: QUEST_GIVEORE:int = 5;      <- gather           54: QUEST_TRADE:int = 14;   <- trade
                                                    56: QUEST_BOUNTYBOARD:int = 15; <- bounty
```
17 `QUEST_*` templates × 20 `REASON_*` motives (:60-98). The ledger conflated two real axes;
it did not invent one. Building "the 9-value enum, not the invented 7" would delete a held enum.

Also wrong in lane_impact: "types 1/3/5/6/7/8 are produced at runtime by QuestGenerator.as."
`grep -n "QuestType\." QuestGenerator.as` returns **nothing**; QuestGenerator only writes the bare
`questData.type = 3` (16 sites). The runtime type rewrites live in `QuestEngine.as:736`
(`QuestType.OngoingQuest`), `:752` (`NormalSideQuest`), `:756` (`HighLvlQuest`), `:760`
(`LowLvlQuest`).

### 8. `quest-log-cap-is-a-row-count` — **REFUTED (fatal)**
`QuestLogUI.as:88-96` is verbatim as quoted (7 buttons, x=60, y=73+55i) and :553 is verbatim. The
7-row scroller is real.

But the claim's headline — "'QUEST_LOG_CAP = 7' is a misread of a UI row count … do NOT ship a
7-quest limit" — is exactly backwards. The cap exists, as a named constant, and it gates
acceptance:

```
reference/decompiled/shs3_android_payload/scripts/StatsManager.as
 164:      internal static var MAXQUESTS:int = 7;
1252: public static function addActiveQuests(questID:int, forceAdd:Boolean = false) : Boolean
1262:    if(activeQuestList.length < MAXQUESTS || forceAdd)
 ...
1273:    return false;                       <- refuses the quest when the log is full
1303: public static function addProcGenDailyQuest(...) : int
1313:    if(activeQuestList.length < MAXQUESTS)
1323:    return -1;                          <- refuses the proc-gen daily when full
```
(identical at the same line numbers in `reference/decompiled/shs3_android/scripts/StatsManager.as`.)

The surveyor says "a grep for an accept-time cap finds only a selection-index clamp" — the grep
missed `MAXQUESTS` because the constant has no underscore. What IS correctable in the ledger is
only the parenthetical gloss "(1 story + 6 side)": the cap is one pooled 7, and `setActiveQuest`
(:1276-1301) pushes story progression unconditionally, bypassing it.

### 9. `player-name-satoshi-resolved` — **HELD, one count wrong (minor)**
I read both frames myself. `zFtCaTO0_1M.mp4` t=68, crop `1920:300:0:730`: the nameplate over the
player's two choice rows reads **GUEST**. `reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg`
(480×270, upscaled ×1.5): the PLAYER sheet's name field over the paperdoll reads **SOUND360TM**.
`questdata.xml:158` is `<id>-2</id>` under the player's own line. NPC 161 resolves to "Satoshi"
in `resolved_names.json`, and appears 14× as `<wave><friend>`. All held.

**Wrong:** `satoshi*` `<img>` tokens total **411**, not 406 — `satoshi` 176 + `satoshi_serious` 209
+ `satoshi_happy` 21 + `satoshi_drunk` 5.

### 10. `reward-and-roster-undercount` — **HELD, one count wrong (minor)**
77 `<reward>` ✓ · 69 `<exp>` ✓ · 68 distinct `<img>` ✓. Every one of the 14 quoted portrait counts
reproduces exactly (kojuro 213 · yuudai 210 · satoshi_serious 209 · fumio 177 · satoshi 176 ·
chikako_mask 77 · hiroshi 65 · hachimaru 65 · fumio_happy 52 · mitsuo 52 · chikako 47 · yasuka 41 ·
shinmen 33 · tanaka 32). Same `<loot>` error as claim 3: **19**, not 18.

### 11. `ally-waves-unlisted-system` — **HELD**
Parent-path histogram: `step/wave/friend` 70 · `step/wave/enemy` 151 · `step/wave/neutral` 2 ·
`step/wave/endless` 4 · `wave/friend/fatal` 59, every value `0`. Enemy `lvl` 2–35, `qty` 1–10,
`x` −400…2000 — all exact. Every ally id resolves as claimed: 164 Fumio ×16, 168 Yuudai ×15,
161 Satoshi ×14, 90 Old Guard ×6, 807 Soldier ×4, 806 Soldier ×4, 197 Mitsuo ×3, 181 Hachimaru ×3,
182 Shou ×3, 144 Hiroshi ×1, 811 Chikako ×1; neutral 118 = "Training Dummy". Nothing to refute.
(There are a further 18 `<enemy>` rows nested under `roomobj/property/obj/property/xml/wave` that
the claim does not count — the claim's 151 is correctly scoped to `<wave><enemy>`.)

### 12. `cutscene-director-held` — **HELD**
`:27414-27420` is verbatim the quoted `<data>` block. The verb histogram reproduces exactly, all 15
verbs summing to 399: anim 107 · walk 76 · create 75 · end 33 · sound 23 · say 16 ·
createprojectile 16 · face 13 · remove 10 · addemitter 7 · removeemitter 7 · pose 6 · darkblur 6 ·
setposition 3 · createobject 1. `<time>` range 0.0–8.0, `<x>` range −200…1600. 55 `<cutscene>` ✓.

### 13. `two-yasukas-confirmed` — **HELD**
`resolved_names.json` → `npcdata.xml.resolved`: exactly one name match for "yasuka",
`('156', 'Yasuka')`. `questdata.xml` portrait tokens `yasuka` ×41, `yasuka_hurt` ×10.

### 14. `step-action-enum-semantics` — **honest STILL_UNHELD, not refuted (but closable now)**
### 15. `outcome-id-namespace` — **honest STILL_UNHELD, not refuted (but closable now)**
Both are correct abstentions — the surveyor did not open the file and did not guess. I opened
them; see New findings N4 and N5.

---

## New findings

**N1 — the web payload ships no quest/item/npc/skill XML.** See HEADLINE. Cross-cutting: this
re-labels four "web payload" data files as Android v0.682 across every unit in the run.

**N2 — `MAXQUESTS:int = 7` is a real accept-time cap.** `StatsManager.as:164` + the gates at
:1262 (`addActiveQuests` returns `false`) and :1313 (`addProcGenDailyQuest` returns `-1`).
`setActiveQuest` (:1276-1301) bypasses it, so story progression is never blocked.

**N3 — the side-quest archetype table is held, in `QuestItem.as`.** 17 `QUEST_*` templates (:26-58)
including `QUEST_TRADE`, `QUEST_BOUNTYBOARD`, `QUEST_GIVEORE`, `QUEST_GUIDE`, `QUEST_DUEL`, and
20 `REASON_*` motives (:60-98). Side quests are *generated*, not authored — a generator port, not
a table port.

**N4 — `<step><action>` semantics are held.** `GameEngine.as:81-109` is a 15-value enum:
0 NOTHING · 1 FIGHT · 2 ASSASSINATE · 3 ESCORT · 4 SURVIVE · 5 REACHMARKER · 6 DUEL · 7 ADVENTURE ·
8 HARVEST · 9 SURVIVALMODE · 10 WARROOMBATTLE · 11 PLAYBACK · 12 PVPROOM · 13 CUTSCENE ·
14 SURVIVECLEANUP. Same namespace confirmed by `QuestEngine.as:1214` (`questStepData.action == 6`)
and :1239/:1243 assigning `GameEngine.ACTION_ADVENTURE` / `ACTION_PVPROOM`. The campaign's measured
domain therefore decodes to NOTHING ×169, FIGHT ×37, DUEL ×5, SURVIVECLEANUP ×3, SURVIVE ×1.

**N5 — the `<outcome><id>` namespace is the StatsManager stat-id space.**
`XMLQuestOutcome.as:50-77`: with `<modify>`, `id == 11` → `addLootCoins`; `2000 <= id < 30000` →
`addLootItemBasic(id, modify)` i.e. the id IS an itemdata id; `id == StatsManager.STAT_XP`
(`StatsManager.as:188`, `STAT_XP = 9`) → `addLootXP`; otherwise `StatsManager.changeStat(id, modify)`.
With `<set>` → `StatsManager.setStat(id, setNo)`. So the quest flag namespace and the save-game
stat namespace are one namespace.

**N6 — count correction:** `<loot>` = **19**, not 18 (claims 3 and 10).
**N7 — count correction:** `satoshi*` `<img>` tokens = **411**, not 406 (claim 9).
