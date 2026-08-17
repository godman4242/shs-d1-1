# quests-story — PRECEDENCE LENS (blind critic)

**Reviewer:** blind critic, LENS 3 (stale-claiming / superseded-source hunting).
**Reviewed:** `docs/gauntlet/L0/systems/quests-story.md` output, 15 claims, proposed score 42 → 78.
**Verdict headline:** 2 FATAL refutations, 1 material refutation, 4 minor numeric corrections,
8 claims survive intact. **Proposed score 78 does not survive; my ceiling is ~62.**

Every verdict below carries an artifact **I** opened myself. Commands are pasted.

---

## ⛔ FATAL 1 — `quests-story/android-caveat-retired` (Q-05) is exactly backwards

The claim: *"the web questdata.xml and the Android 116_Mobile_QuestData.bin are byte-identical
apart from one trailing newline… the standing Android v0.682-vs-web v0.717 caveat DOES NOT
apply to quests-story."*

The byte check reproduces. It proves nothing, because **`reference/extracted/questdata.xml`
is not a web artifact.** The web payload contains no quest data at all.

Direct test — hex-grep the full 329 MB FFDec XML export of the *web* payload
(`reference/extracted/payload.xml`, which stores every `DefineBinaryDataTag` as
`binaryData="<hex>"`):

```
$ for h in 3c7175657374646174613e 3c6974656d646174613e 3c6e7063646174613e \
           3c736b696c6c646174613e 4a696e626569 3c616e696d646174613e; do
      printf "%s : " "$h"; LC_ALL=C grep -c "$h" reference/extracted/payload.xml; done
3c7175657374646174613e : 0      # "<questdata>"
3c6974656d646174613e   : 0      # "<itemdata>"
3c6e7063646174613e     : 0      # "<npcdata>"
3c736b696c6c646174613e : 0      # "<skilldata>"
4a696e626569           : 0      # "Jinbei"
3c616e696d646174613e   : 19     # "<animdata>"  <-- control: the animdata IS there
```

The 19 `<animdata>` control hits prove the grep works and that the export really does carry
inline binary. The web payload's binary inventory is exactly Stage-0 finding **S0-1**:
19 animdata + survivalmodedata + room-object defs + 5 name-generator tables + 1 GIF = 27 blobs.
`reference/extracted/bindata/` (27 files, extracted from that same export) contains no file of
size 796383 and no quest data. **There is no web questdata.**

Corroboration 1 — the three sibling XMLs are the Android blobs with the prolog and the trailing
CRLF sliced off, which is an extractor signature, not a build coincidence:

```
itemdata   web 184002  android 184044  ->  android.find(web) = 40, remainder b'\r\n'
npcdata    web 228413  android 228455  ->  android.find(web) = 40, remainder b'\r\n'
skilldata  web  39003  android  39045  ->  android.find(web) = 40, remainder b'\r\n'
questdata  web 796383  android 796384  ->  android.find(web) =  0, remainder b'\n'
  (the 40 bytes = '<?xml version="1.0" encoding="utf-8"?>\r\n'; questdata has no prolog,
   so nothing was sliced off its head — hence the 1-byte, not 42-byte, delta)
```

Corroboration 2 — mtimes. All four XMLs are `Jul 25 18:27`.
`reference/decrypted/shs3_android_payload_decoded.swf` is `Jul 25 17:38` (**earlier**).
`reference/decrypted/shs3_payload_decoded.swf` — the *web* payload — is `Jul 25 18:33`
(**six minutes later**). The web payload had not been decoded yet when those XMLs were written.

Corroboration 3 — the surveyor's own Q-06 refutes Q-05. Q-06 shows the shipped build's Prologue
lines differ from `questdata.xml`. That is not a "rewrite"; it is the v0.717 web build against
v0.682 Android data. **It is direct empirical proof that the S0-3 build caveat bites hardest
precisely here** — the one place the surveyor declared it retired.

**Consequence:** the whole quests-story unit is Android v0.682 evidence. Every claim in it must
carry the v0.682 label — data AND code, not just code as Q-05 recommends.

**Own cite (A3 + A2):** hex grep above over `reference/extracted/payload.xml`;
`reference/extracted/bindata/` (27 files, none quest data); Stage-0 S0-1 inventory.

---

## ⛔ FATAL 2 — `quests-story/quest-log-cap-is-a-row-count` (Q-08) is wrong; the ledger was right

The claim: *"'QUEST_LOG_CAP = 7' is a misread of a UI row count… a grep for an accept-time cap
finds only a selection-index clamp."* Its lane impact: *"do NOT ship a 7-quest limit."*

That grep missed the cap. It is one file away, in the class the surveyor already had open for
Q-04's `StatsManager.checkConditions`:

```
$ grep -rn "MAXQUESTS" reference/decompiled/shs3_android_payload/scripts/
StatsManager.as:164:      internal static var MAXQUESTS:int = 7;
StatsManager.as:1262:         if(activeQuestList.length < MAXQUESTS || forceAdd)
StatsManager.as:1313:         if(activeQuestList.length < MAXQUESTS)
```

`StatsManager.as:1257` `addActiveQuests(questID, forceAdd=false)` returns **false** and adds
nothing when the list is full. `:1313` is the same gate on the proc-gen daily/trade path.

The 7 scroller rows are downstream of the cap, not a coincidence: `MAXQUESTS = 7` and
`questLogButtonList.length = 7`. The scroll buttons exist because `forceAdd = true` lets a
*story* quest push the list past 7 — which is exactly the ledger's "1 story + 6 side" shape,
now with a mechanism. Shipping "no 7-quest limit" would be a fidelity regression.

**Own cite (A2):** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:164`
`internal static var MAXQUESTS:int = 7;` + `:1262`.

The geometry half of Q-08 (`x=60, y=73+i*55`, 7 rows) I confirmed at `QuestLogUI.as:89-95` and
the scroll-visibility line at `:553` — that part stands.

---

## ⚠️ MATERIAL — `quests-story/verbatim-script-held` (Q-01), last clause disproven by frame

The corpus half is real and I verified both cites. The clause **"so those lines are what the
game renders"** is false, and the surveyor's own Q-06 says so four claims later.

I re-derived Q-06 independently rather than trusting it — extracted my own frames and cropped:

```
ffmpeg -ss {62,68,72,76} -i reference/videos/zFtCaTO0_1M.mp4 -frames:v 1 f{t}.png
ffmpeg -i f{t}.png -vf "crop=1400:360:0:700,scale=2100:540:flags=lanczos" c{t}.png
```

**Visible in my crops** (nameplate tab + parchment box, 1.5× upscale):

| t | nameplate | on-screen text | `questdata.xml` |
|---|---|---|---|
| 62 | JINBEI | "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY." | :128 "Ah! A new face in this territory! My, it isn't often we see people walk this road alone…" — **DIFFERENT** |
| 68 | GUEST | row 1 "I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE." / row 2 "THESE BANDITS DON'T SCARE ME!" | :149 **EXACT** / :153 "They'll get nothing from me!" — **DIFFERENT** |
| 72 | GUEST | "HOW ABOUT I HAND OVER HALF THE LENGTH OF THIS SWORD -- SHARP END FIRST. WILL [THAT] SUFFICE AS PAYMENT?" | :183 same line prefixed "I say " — **NEAR-EXACT** |
| 76 | JINBEI | "THAT'S TOO BAD, TRAVELER. IT REALLY IS…" | no such line anywhere: `grep -n -i "too bad" questdata.xml` → 3 hits, all unrelated (:4262, :19794, :24531) — **ABSENT** |

**THE FRAME WINS, and I say so out loud:** where `questdata.xml` and the longplay disagree, the
longplay is the shipped game. Q-06 is the unit's best work and I confirm it verbatim. But it
means Q-01 overstates: the payload is a *script-complete corpus of a different build*, not the
render source.

**Own cite (A1):** `reference/videos/zFtCaTO0_1M.mp4` t=62/68/72/76, crop (0,700)–(1400,1060),
upscaled 2100×540 → `…/scratchpad/crit_q/c62.png, c68.png, c72.png, c76.png` (my own extraction,
independent of the surveyor's `qframes/`).

---

## 📉 STALE-CLAIMING — Q-01 and Q-02 overturn a ledger line their own document already retired

This is the lens's core catch. `docs/research/REBUILD_READINESS.md` opens with a
**STALENESS BANNER dated 2026-08-13** (two days before this run) whose table already reads:

```
| §4 quests-story: "verbatim dialogue — captured NOWHERE"; §6: "structurally unrecoverable"
| questdata.xml — 2,771 <dialogue> blocks, 3,307 verbatim <text> lines, 471 <choice>, full <cutscene> direction |
| §3.8: "Ep4–12 were likely never shipped… faithful campaign = Prologue–Ep3"
| 61 quests: Prologue → Episodes 1–12 → Epilogue → a Season 2 hook. The campaign is complete |
```

Q-01 and Q-02 quote the **superseded** §6:347 and §3.8 bodies as live and flag
`overturns_ledger: true`. They do not overturn the ledger — the ledger overturned itself, in the
same file, above the text being quoted. The findings are true; the *novelty* credit is not.
Discount both from the score rationale.

**Own cite (A2/ledger):** `docs/research/REBUILD_READINESS.md:26-33` (banner table);
the quoted bodies live at `:347` and `:229-231`.

---

## ✅ SURVIVES — re-measured first-hand

I re-parsed `reference/extracted/questdata.xml` with ElementTree (parent map, so parent/child
relationships are real, not regex-guessed):

```
choice 471 · children {text:467, goto:471, condition:7, outcome:0}     -> Q-04 EXACT
quest <type> {2:37, 4:22, 0:2}                                          -> Q-07 EXACT
step 225 · node 225 · roomobj 225 · <step><action> {0:169,1:37,6:5,14:3,4:1}=215 -> Q-03/Q-14 EXACT
reward 77 · exp 69 {100,200,250,290,500,600,750,1000,2000,3000}         -> Q-03/Q-10 EXACT
<img> 1918 total, 68 distinct                                           -> Q-10 EXACT
wave 118 · friend 70 · neutral 2 · endless 4                            -> Q-11 EXACT
friend id histogram {164:16,168:15,161:14,90:6,807:4,806:4,197:3,181:3,182:3,144:1,811:1} -> Q-11 EXACT
friend <fatal>: {'0':59, absent:11}                                     -> Q-11 EXACT ("59 of 70")
cutscene <data> 399, 15 verbs {anim107,walk76,create75,end33,sound23,say16,
  createprojectile16,face13,remove10,addemitter7,removeemitter7,pose6,darkblur6,
  setposition3,createobject1}                                           -> Q-12 EXACT
<outcome><set> 194, 28 distinct ids, range 42..40002                    -> Q-15 EXACT
```

Name resolution spot-checked in `docs/gauntlet/L0/index/resolved_names.json`:
`13100 → "Iron Sword"`, `2103 → "Small Rice Ball"`, `20108 → "Crane Feather"`,
`161 → "Satoshi"`, `156 → "Yasuka"` (the only Yasuka), `118 → "Training Dummy"`,
`164 Fumio`, `168 Yuudai`, `90 Old Guard`, `806/807 Soldier`, `197 Mitsuo`,
`181 Hachimaru`, `182 Shou`, `144 Hiroshi`, `811 Chikako`. Q-13 and Q-11's roster hold.

AS3 cites opened and confirmed: `LangManager.as:95` `getQuestString` early-returns non-"ID"
strings; `XMLQuestChoice.as:38` `applyOutcome`; `QuestType.as` 9-value enum;
`QuestLogUI.as:89-95` + `:553`.

Q-09's second frame confirmed by my own 4× upscale of
`reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg` (480×270 → 1920×1080): the PLAYER sheet
name field reads **SOUND360TM**, and my t=68 crop's nameplate reads **GUEST**. Both hold.

Q-14 and Q-15 are honest STILL_UNHELDs with correct measured domains and real close-paths
(`XMLQuestOutcome.as` and `QuestAction.as` both exist in that scripts dir). Do not penalise them.

---

## 🔧 Numeric corrections (minor, thesis unaffected)

1. **`<loot>` is 19, not 18** (Q-03 and Q-10 both say 18). All 19 are children of `<reward>`.
2. **`<wave><enemy>` is 169, not 151** (Q-11). All 169 parent to `<wave>`; there are no
   `<enemy>` rows elsewhere. An 11 % undercount of L4's free encounter table.
3. **Q-03's coordinate breakdown "348+52+14+97" does not reproduce.** Measured: 636 `<x>`
   elements, parents `{obj:348, enemy:109, data:76, roomobj:52, friend:49, neutral:2}`.
   `obj 348` and `roomobj 52` are right; the other two numbers are not what is in the file.
   There are zero `<y>` elements.

---

## Score

The surveyor's 78 rests on Q-05 (retired build caveat — refuted, and inverted), Q-08 (cap is a
row count — refuted), Q-01's render-source clause (refuted by frame), and two already-banked
ledger overturns. What genuinely survives is still a lot: a complete 61-quest / 2,771-dialogue
Android-build corpus, a closed 15-verb cutscene director, a flat 471-row choice graph, a named
9-value QuestType enum, a 68-portrait manifest, and a 70-row ally-wave subsystem nobody listed.

But it is all **v0.682 Android** evidence for a **v0.717 web** target whose dialogue is
demonstrably different, and the only line-level ground truth is whatever the two longplays show.
**My ceiling: 62.**
