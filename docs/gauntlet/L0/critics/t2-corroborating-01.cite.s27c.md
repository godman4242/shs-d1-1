# t2-corroborating-01 — CITE LENS review (s27c)

**Packet:** `docs/gauntlet/L0/worklist/t2-corroborating-01.json` — 14 findings, all `citelint: RESOLVES`,
all `overturns_ledger: false`.
**Judged:** 14 of 14. **Skipped:** none.
**Result:** 0 refuted · 14 survive · 2 carry MATERIAL defects that must be fixed before banking ·
6 carry MINOR defects · 4 new findings filed.

Zero refutations is an unusual result for this lens and I want to be explicit about why it happened:
this packet is almost entirely AS3 line-quoting, and AS3 line-quoting is the easiest kind of claim to
verify and the hardest to fake. I opened every cited file. Where a claim quoted a line, I diffed the
quote against the file. Where a claim reported a census, I re-ran the census from scratch rather than
sampling it. Three censuses reproduced to the last integer. What I *did* find is a consistent pattern
of defects in the **secondary** cites — the pointers into `REBUILD_READINESS.md` and
`LEDGER_EVIDENCE.md`, which `citelint` cannot catch because those files are long enough that any line
number "resolves". Two of those are material.

---

## The one that matters most: a frame beats the prose that cited it

**`NF-S27B-4/the-change-stance-label-is-a-hover-tooltip-on-the-portrait`** — cite includes
`reference/frames/session11/crit-focus/t1003.000.png crop (0,820)-(660,1080) 3x LANCZOS
(portrait present, no CHANGE STANCE text)`, and the prose says *"the words 'CHANGE STANCE' appear in
NO combat frame I opened"*.

I opened that frame, at that exact crop, at that exact upscale. The words **CANNOT CHANGE STANCE** are
plainly rendered, in grey, on the third HUD bar, under a green `14/20` and a blue `31/31`.

**THE FRAME WINS.** Saying it out loud as the standing invariant requires.

The finding is not destroyed by this, because its actual mechanism claim is bulletproof and I verified
every line of it in both builds:

| web `§1t113s0§.as` | android `BattleUI.as` | what it does |
|---|---|---|
| `:146` `getString(208)` | `:110` `getString(208)` | label text — and `strings.json["208"]` = `Change Stance` |
| `:200` `visible = false` | `:160` `changestancelabel.visible = false` | hidden at construction |
| `:241` / `:242` | `:192` / `:193` | MOUSE_OVER / MOUSE_OUT on the bust |
| `:542-543` / `:548-549` | `:432-433` / `:438-439` | show/hide label **and** `highlight.visible` |
| `:379` hitTest gate | `:275` `battlemodebust.hitTestPoint` | the bust is the hit target |

String 208 resolving to `Change Stance` independently confirms the whole obfuscation map the finding
proposed (`§1t5158s0§` = battlemodebust, `§1t5215s0§`/`§1t5216s0§` = show/hideChangeStanceLabel,
and — my addition — `§1t5161s0§` = changestancelabel).

So the claim survives **only in its precise form**: the *string-208 hover tooltip* is never standing.
What is on screen in the frame is the *string-960 grey caption* (`§1t5169s0§`), a different field on a
different widget, proven by the two neighbouring findings in this same packet. Bank the mechanism,
**strike the frame parenthetical**, or L8 will read "no CHANGE STANCE words in the HUD" and omit a
caption that is prominently on screen. Severity: material.

---

## The other material defect: a ledger pointer six lines off target

**`hunter-s27b/the-per-stance-mastery-curve-is-linear-and-closes-the-ledgers-mastery-fork`** cites
`docs/research/REBUILD_READINESS.md:161-163` and calls it "item 3".

`:161-163` is **item 5** (Chi is a ~10-based pool) and **item 6** (AP is a real third resource).
Item 3 — the stance-table / mastery-9 fork — is at **`:155-157`**. The finding's own `ledger_text`
field quotes item 3 correctly, so the target sentence is unambiguous; only the pointer is wrong. But a
rewriter following `:161-163` would "close" the Chi and AP items instead of the mastery fork. Correct
to `:155-157` before banking.

The AS3 half is exact and the arithmetic re-derives cleanly:

- `§1t99s0§.as:3258` base = `minDamage + Math.random() * damageRange`
- `:3262` Light `* (0.5 + 0.4 * m * 0.1)` · `:3265` Balanced `* (1 + 0.2 * m * 0.1)` ·
  `:3270` Heavy/Dual/Reversed `* 1.4` (three-case fallthrough at `:3267-3269`)
- m=0 → **0.5 / 1.0 / 1.4** = the ledger's level-1 Shugyōsha row.
  m=10 → **0.9 / 1.2 / 1.4** = the ledger's ceiling row. Both ends land exactly.
- Android really does diverge: `MCSPlayer.as:3205` `0.5 + 0.5*m*0.01`, `:3208` `1 + 0.5*m*0.01`,
  `:3213` Heavy `* 1.5` — a 0–100 mastery scale. The do-not-port warning is right.

---

## Censuses I re-ran rather than trusted

**`NF-S27B-1` — npcdata mastery census.** Python regex over all 495 `<npc>` blocks:
skill **1000 → 76** rows, **1001 → 77**, **1002 → 79**; of those, **74 each at `<lvl>10</lvl>`**, the
remainder at 2–3. Identical to the claim, digit for digit. 419 of 495 NPCs therefore evaluate the
stance curve at mastery 0. `StatsManager.as:689` is verbatim `initNewPlayer(...)` and `:740-742` are
the three `IntStat(1000|1001|1002, 1)` pushes *inside it* — the `1` is provably a fresh-save default,
not an index base. `XMLNpc.as:685` is `return 0;`.

I also strengthened it past its own cites: android `MCSPlayer.as:109/:111/:113` declare all three
mastery **fields** `= 0` (the finding only had `EnemyElite`'s local var), and the **web** StatsManager
twin `§1t1523s0§.as:1058` and `:2586` push `§1t100s0§(1000,1)` — so the player default of 1 is
web-attested too. The android-only parity hole I was going to flag discharges itself.

**`lens3/human-anim-node-count`** — the strongest claim in the packet. I parsed all 158 `<anim>`
blocks of `108_1t4635s0.bin` and counted `<n>` per `<f>`:

- per-anim maximum histogram `{13:3, 17:13, 18:10, 19:130, 20:2}` — **exact match**
- anims whose per-frame count varies within the clip: **44** — exact match
- `deathnohead` 31 frames `[17 ×23, 1 ×8]` · `deathnohand` 25 frames `[17 ×23, 3 ×2]` ·
  `deathinhalf` 28 frames all 17 — exact match
- the quoted frame is byte-exact: `<f i="23">\r\n<n i="16" x="-188" y="-7" r="168"></n>\r\n</f>`

The only correction *enlarges* the finding: **26** anims carry empty frames, not the 7 listed (those 7
are just the first 7 in document order). `gangnam` is empty on 44 of 88 frames and `sheathesword3` on
22 of 33. Filed as a new finding — carry-forward-last-transform is mandatory, not an optimisation.

**`nf-judge/carry-weight-exemption-split`** — re-ran the grep: 16 hits, 11 files, **9 exempt / 7
unexempt**, every line number correct, `Obj_Hut.as:48` verbatim. 9/7, not 8/8, confirmed.

**`lens3/severed-limb-blob-build-label`** — recomputed both hashes:
`bcfd658e79fafb41f52431afb7d10622`, 977,277 bytes each. I also checked the *premise* rather than
inheriting it from the Stage-0 brief: `reference/decompiled/shs3_payload/scripts/§1t4635s0§.as` exists,
so blob 108's class is a **web** class and the join is genuine parity, not C2's circular self-diff.

---

## The save-schema cluster: nineteen, and I counted them by hand

Three findings (`offline-save-write-branch-is-nineteen`, `the-fourteen-field-save-finding-is-a-
truncated-read`, `the-offline-save-record-is-nineteen-plus-a-sentinel`) all hold on the same lines.

`QueryManagerBase.as`: the `!offlineMode` branch (`:2905-2909`) writes two fields; the `else`
(`:2910`) runs `:2912`→`:2930` and closes at `:2931`. Nineteen assignments, counted individually.
The fourteen-field window `:2910-2925` stops exactly at `booleanStats` — so "truncated read" is
precisely the right diagnosis, and the five dropped fields (`activeQuestList`, `completedQuestList`,
`playerlocation`, `taunt`, `friends`) are the entire quest-progress and world-position half of the
save. Confirmed twice more: the delete twin blanks the same nineteen at `:2941-2959`, and the web twin
`§1t1832s0§.as:2815-2833` blanks nineteen in the identical order — positions 4, 6, 9, 10, 17, 18, 19
survive obfuscation and line up one-for-one.

The sentinel finding's ten line numbers I enumerated with `grep -n 'data.saved'` rather than trusting
offsets: `:2789 :2798 :2814 :2850 :2865 :2881 :2938 :2956` web, `:2940 :2967` android — all exact.
Minor: the prose says those three gates "all open with `if(...) { return; }`". They gate, but `:2881`
runs three calls then `return false;` at `:2885`, and `:2938`/`:2956` return false. The gate claim is
right; the paraphrase is not literal.

`offline-save-write-branch-is-nineteen` and `the-fourteen-field-save-finding-is-a-truncated-read` are
near-duplicates on identical evidence. Both hold — bank them as **one** entry so the ledger does not
count a single reading twice.

---

## Minor defects worth fixing at bank time

| Finding | Defect |
|---|---|
| `NF-S27B-2` | Both `LEDGER_EVIDENCE.md` pointers are wrong. I opened `:158-162` (calcXP entry) and `:1628-1632` (clan-war heading) — neither carries the quoted sentences. The AS3 cite field is clean. |
| `NF-S27B-3` | Cite lists `§1t113s0§.as:256`, which is an unrelated CLICK wiring supporting nothing. Substitute `:110-111`, which is where the two captions are actually built. |
| `NF-S27B-5` | The banked war-map entry is at `LEDGER_EVIDENCE.md:3321`, **not** `:3207` (`:3205-3209` is the rebirth Heavenly-Gold entry). The quoted build note is verbatim at `:3321`. |
| `hunter-s27b/heavy-reach` | RR's "reach cap in px per stance" is on `:87` (bullet spans `:87-88`), not `:88`. |
| `web-and-android-per-stat-ceilings` | Arithmetic slip: android AP at level 80 is `20 + (80+10) = **110**`, not 90 — the finding reused the ATK ceiling. Web 480 vs android 110 is still a 4.4× divergence, so the S0-3 lesson is untouched. Everything else (271 vs 90 ATK, 910 vs 460 HP, CHI unchanged) re-derives correctly. |

`NF-S27B-5` deserves one positive note: the finding's identification is stronger than it claimed.
`§1t7934s0§` carries the **unobfuscated** member `flagcanvas` at `:301`/`:323`, exactly as
`WarSelectUI` does — identity settled beyond the constant match. And `§1t1524s0§` really is the
QuestEngine twin: 1,592 lines, embedding the map GIF class at `:87` and loading it at `:701`.

---

## New findings filed (4)

1. **`s27c-cite/cannot-change-stance-caption-is-confirmed-ON-A-FRAME`** [A1, HELD] — the frame above
   confirms `NF-S27B-2` and `NF-S27B-3` from the primary reference for the first time. `§1t113s0§.as:111`
   defines the caption as `"<font color='#BBBBBB'>" + getString(960) + "</font>"`, shown iff
   `ratio == 0` at `:336`; the frame shows precisely that state. Web string 960 = `CANNOT CHANGE
   STANCE` is now attested *from the frame*, even though the android table has no key 960 at all.
2. **`s27c-cite/the-reach-base-is-a-speed-derived-slash-length`** [A2, PARTIAL] — closes the one open
   unknown in `hunter-s27b/heavy-reach`. `§1t4420s0§` = `baseSlashLength`: web `:105` init 10, `:194`
   assigned from the 10th `initPlayer` param, `:223` halved in one branch — positionally identical to
   android `MCSPlayer.as:107/:182/:193/:222`. For NPCs the caller computes it:
   `EnemyElite.as:102` `120 + floor(90 * speed / (20 + speed))`, so 120 px at speed 0 saturating toward
   210. At base 120 heavy-at-mastery-0 is 60 → the 100 px floor genuinely bites. Formula is v0.682;
   the *shape* is web-attested. Also adds two web stance cases the original missed: `:3131` Dual `×1.4`,
   `:3142` Reversed `×1.0`.
3. **`s27c-cite/the-150-percent-damage-readout-matches-no-web-multiplier`** [A1, **STILL_UNHELD**] —
   the same frame shows a yellow `150% DAMAGE` line. No web multiplier reaches 1.5 (max is Heavy 1.4,
   crit 1.3); android Heavy is exactly 1.5. I did **not** resolve which field paints it —
   `§1t5208s0§` is only `gotoAndStop` on a stance icon, and grep finds no `%`-composed damage string in
   either BattleUI. It may be a skill popup with nothing to do with stance damage. Filed as a lead, not
   a refutation, but the web stance table should be CONTRACT-*pending* until someone names that field.
4. **`s27c-cite/twenty-six-human-anims-carry-empty-frames-not-seven`** [A2, HELD] — full list in the
   JSON. 16% of human clips contain frames that key nothing.

---

## Method note

Every verdict in the JSON carries an `own_cite` naming the artifact **I** opened. Where I re-ran a
census I state the command and the result rather than the conclusion. Where I extended a finding past
its own evidence (the web `IntStat(1000,1)`, the `flagcanvas` identity, the `§1t4635s0§.as` provenance,
the `baseSlashLength` chain), that extension is in the verdict reason so the ledger inherits the
stronger version, not the original.

The recurring lesson for this lane: `citelint` proves a line *exists*. It cannot prove the line is the
line you meant. Four of the six defects I found are pointers into long documentation files that
resolve mechanically and are simply aimed at the wrong paragraph. A cite into `REBUILD_READINESS.md`
or `LEDGER_EVIDENCE.md` should quote the sentence, not only the line — two of the findings here did
exactly that in their `ledger_text` field, and that is the only reason their mis-aimed pointers were
recoverable instead of fatal.
