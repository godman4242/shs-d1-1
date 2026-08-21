# t1-overturns-01 — HUNTER LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **24 findings, all 24 judged, 0 skipped.**
Every verdict below rests on an artifact **I opened myself** in this session. Nothing was taken
from another agent's prose (`critics/`, `sources/` never opened).

---

## HEADLINE — THE PACKET IS READING THE WRONG BUILD ON COMBAT MATH

The single biggest result of this review. `reference/decompiled/shs3_payload/` **is** the web build:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36
      public static var §1t9323s0§:Number = 0.717;
reference/decompiled/shs3_android/scripts/StatsManager.as:30
      public static var clientVersion:Number = 0.682;
```

`§1t99s0§.as` is the **web twin of `MCSPlayer`** — identity proved by four consecutive functions in
the same order with identical bodies (getDamage / getDefense / deductReloadBar / bonusReload), the
same stance grouping (BALANCED+REVERSED vs HEAVY+DUAL in the reload deduction) and the same
`5 * 24` reload constant. Its combat math is **NOT** what the packet claims:

| | android v0.682 (`MCSPlayer.as:3198-3223`) | **web v0.717** (`§1t99s0§.as:3255-3277`) |
|---|---|---|
| Light | `base * (0.5 + 0.5*lightMastery*0.01)` | `base * (0.5 + 0.4*lightMastery*0.1)` |
| Balanced | `base * (1 + 0.5*balancedMastery*0.01)` | `base * (1 + 0.2*balancedMastery*0.1)` |
| Heavy/Dual/Reversed | `base * 1.5` | **`base * 1.4`** |
| crit branch (reload==maxreload) | `*1.5` Light / `*1.2` other `+ STAT_CRITICALDMG` | **`* 1.3 + STAT_CRITICALDMG`** |

Two consequences that rewrite the packet's own conclusions:

1. **`CRIT_MULT=1.3` is CONFIRMED, not killed.** NF-1's lane_impact says it "kills
   REBUILD_READINESS.md:152-153's ruling to 'Keep CRIT_MULT=1.3'". The web build literally
   returns `_loc2_ * 1.3 + …`. The ledger ruling stands with an A2 cite behind it now.
2. **The mastery-ceiling stance table is CONFIRMED.** skilldata skill 1000 has ten `<level>`
   rows (value 1…10). Feed mastery 10 into the **web** formula:
   Light `0.5+0.04*10 = 0.90` · Balanced `1+0.02*10 = 1.20` · Heavy `1.40`.
   That is **exactly** REBUILD_READINESS.md:155's `dmg 0.9/1.2/1.4` "MASTERY-9 CEILING" table
   (mastery level 10 = 9 required points, per `<required>9</required>` on the level-10 row).
   NF-category-11 claims to overturn that sentence; the web payload proves it right.

`Heavy defender Defense ×0.8` is likewise confirmed twice — `§1t99s0§.as:3286-3290`
(`if(stance == HEAVY) return defense * 0.8;`) and skill 1002's own description,
`strings.json` via resolved_names: *"Heavy Stance Mastery … Defense -20%"*.

**Net effect on the ledger:** of the four combat-math findings in this packet that claim to
overturn REBUILD_READINESS.md's damage formula, **none of them do.** Two of them are wrong for
the build the recreation targets.

---

## VERDICT TABLE

| # | id | refuted | overturn upheld | severity |
|---|---|---|---|---|
| 0 | NF-1-crit-is-deterministic-full-focus | **YES** | yes (blocker ⑤ falls) | material |
| 1 | NF-15-consumable-buff-enum… | no | **no** | minor |
| 2 | NF-38-cases-35-classes | no | **no** (names no ledger sentence) | minor |
| 3 | NF-5-per-stance-damage-multipliers | **YES** | **no** | material |
| 4 | NF-9-dragon-dance-input-recovered | no | **yes** | — |
| 5 | NF-ai0-duel-opponent-absent | no | **no** | minor |
| 6 | NF-boss-hp-derivation | no | **no** | minor |
| 7 | NF-category-11-decoded | no | **no** | minor |
| 8 | NF-enemy-skill-ladder | no | **no** | material |
| 9 | NF-four-faction-spawn-model | no | **no** | minor |
| 10 | NF-kill-xp-formula | no | **yes** (half) | — |
| 11 | NF-level10-clamp | no | **no** | minor |
| 12 | NF-melee-ai-geometry | no | **no** | minor |
| 13 | NF-npcdata-silences | no | **no** | minor |
| 14 | NF-procgen-surnames | no | **yes** (2 of 4) | — |
| 15 | NF-stage-800x480 | no | **yes** | — |
| 16 | build-divergence-7-cooldown-cap | no | **no** (sentence not in ledger) | minor |
| 17 | repair-weapon-cost-formula | no | **yes** | — |
| 18 | slash-line-colour-is-0x990000 | no | **no** (sentence not in ledger) | minor |
| 19 | war-board-is-a-6x6-square-grid | no | **no** (sentence not in ledger) | minor |
| 20 | 690-is-the-friend-bar | no | **no** | minor |
| 21 | 690-is-the-friend-panel | no | **no** | minor |
| 22 | 800x690-is-the-friend-bar-layout | no | **no** | minor |
| 23 | anim-loop-flag | no | **no** | minor |

**2 refuted · 22 survive · 6 of 24 claimed overturns actually land.**
203 claimed overturns were about to rewrite REBUILD_READINESS.md; in this packet **75 % of the
overturn claims are inflated** — the finding is true (or true-for-android) but the sentence it
points at survives untouched, is confirmed by the same evidence, or is not in the ledger at all.

---

## THREE FAILURE MODES I FOUND, IN ORDER OF COST

### 1. Android numbers presented as the game's numbers (fatal for a rebuild)
NF-1 and NF-5 (idx 0 and 3). Both transcribe `shs3_android/scripts/MCSPlayer.as` verbatim and
correctly — and both would make a builder code the wrong constants for v0.717. NF-1 goes further
and asserts web parity in its `build` field ("web longplay cooldowns reproduce from this
codepath"); its own sibling finding, build-divergence-7, proves the two builds diverge on combat
tuning. **Every combat constant taken from `shs3_android/` must be diffed against
`shs3_payload/` before it is banked.** The obfuscated twin is findable: match the function
*order* and the numeric literals, not the names.

### 2. Overturning a sentence the evidence actually confirms
- idx 20/21/22 all name **REBUILD_READINESS.md:117** — *"native canvas is 800×480 (5:3), so HUD
  x-fractions measured off 16:9 video may be pillarbox-wrong."* Their evidence (`GameEngine.as:269-282`,
  the SWF rects) **proves both halves of that sentence.** idx 20 even concedes the frame is 0.89 %
  off and says "do not treat frame-derived HUD fractions as exact" — that IS the sentence. Nothing falls.
  (The sentence that *does* fall to this evidence is ui-hud blocker ① at :235 — which idx 15 correctly names.)
- idx 11 names the enemies-ai Surface line at :221 (*"…not the ~1-HP-chip field trash the video
  shows"*). `NPC.as:253-259` **mechanises** that suspicion — it vindicates the ledger. The only clause
  that falls, *"every PvE number lives only in notes"*, was already retired by the doc's own
  STALENESS BANNER at :33.
- idx 6 names the damage-math line at :74 — every term of which I just confirmed in the web payload.
- idx 7 names the mastery-ceiling correction at :155 — which the web formula reproduces to three decimals.

### 3. ledger_text that is not in the ledger
idx 16, 18 and 19 quote *"SPEED 300 is the cooldown cap"*, *"slash line colour 0xA30000"* and
*"War board is a hexagonal grid"*. None of those strings exist in `docs/research/REBUILD_READINESS.md`
(grep: zero hits for `SPEED 300`, `A30000`, `hexagon`). They overturn **peer claims**, not the ledger.
All three are excellent findings; none of them should be counted toward the 203 ledger rewrites.
For the record, the ledger sentences they *should* have named and *do* close:
- idx 16 → skills-meters blocker ④ *"SPD→cooldown formula"* (:195)
- idx 19 → meta-social blocker ② *"War-Room map topology (board/adjacency)"* (:236)

---

## PER-FINDING NOTES (only where I add something)

**idx 0 · NF-1 — REFUTED (material).** Verbatim-correct against `MCSPlayer.as:3215-3223`. The crit
IS deterministic and IS gated on a full reload bar — and I confirmed that holds in the web build
too (`§1t99s0§.as:3272-3276`), so **blocker ⑤ genuinely falls**. Refuted on the numbers: 1.5/1.2 is
android-only; web is a flat 1.3. Bonus grounding for the "Focus" reading: resolved_names skill 1005
= *"Focus — Instantly recharges your focus bar"*, and `MCSPlayer.as:1168/3272` push the same variable
into `BattleUI.updateReload()`. The reload bar **is** the Focus meter.

**idx 1 · NF-15 — HELD, overturn inflated.** I cropped the frame myself:
`reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`, crop (0,820)-(760,1080), ×3 Lanczos — gold
`150% DAMAGE` sits directly under a brown `CANNOT CHANGE STANCE` bar, below green 20/20 and blue
26/26. strings 4132-4135 and `StatsManager.as:288-312` check out exactly. But the sentence it names
(ui-hud blocker ② — *bar tween vs snap, combo pop, vignette ramp*) is about HUD **motion**. A static
gold label says nothing about it. The neighbouring blocker ③ (*floating damage/crit popups*) is the
one this bears on, and even there it warns against a mis-read rather than closing it.

**idx 2 · 38 cases / 35 classes — HELD.** Counted myself: 38 `case` arms, 32 distinct `Enemy*`
classes + `FriendlyElite`/`FriendlySpearElite`/`FriendlyArcher` = **35**. `overturns_ledger=true`
with `ledger_text: null` — it names nothing, so nothing falls. ⚠ One sub-claim fails my census:
*"exactly those 73 [ai 9] rows carry the full stance-mastery kit."* Rows carrying all of
1000+1001+1002 = **74, spread across ai 9 (45), ai 28 (20), ai 14 (7), ai 30 (2)**. 28 ai-9 rows
do not carry the full kit.

**idx 4 · Dragon Dance — HELD, overturn upheld, and STRONGER than claimed.** Every cited line is
verbatim. And the parity caveat is unnecessary: the web v0.717 build carries the same ring —
`shs3_payload/scripts/§1t5495s0§.as:70-71` has both label arrays byte-for-byte, and
`§1t8695s0§.as:172-212` carries the same five permutations. Blocker ④'s *input* half is closed in
both builds; the *Kanji-statue bonus* half still wants a cite.

**idx 5 · ai 0 absent — HELD, overturn inflated.** My own census of `reference/extracted/npcdata.xml`:
425 `<ai>` values; unused in 0..37 = **{0, 10, 15, 16}** — exactly as claimed. `XMLNpc.as:36`
DEFAULT_EQSTRING (13 fields), `initDuelist` at `:290`, `parseEquipmentString → Vector.<Item>(13)`
at `:705` all verified. But the sentence it names is enemies-ai blocker ④ *aggro/leash/spawn
geometry*, which this finding never touches.

**idx 8 · enemy skill ladder — HELD (material qualification).** Every gate reproduced verbatim
(6/20/12/70 × three stance families, `rand(2)`; 1005 at level ≥10 with `rand(3)`). ⚠ The sentence
*"the runtime moveset is not read from npcdata's `<skills>`"* is **wrong as written**:
`EnemyPlayer.as:820` does `skillList = xml.skillList;` for every non-boss, and `generateSkillList()`
is called from exactly one place — inside `setLevel()` (`:143`). `setLevel` only runs when a spawn
passes `lvl != 0` (`NPCManager.as:877/893/908/932`). So npcdata **is** the moveset unless the wave
data rescales the level, in which case the date-seeded ladder replaces it. And the named ledger
sentence (*telegraph/active/recovery + stagger frames*) has nothing to do with skill unlocks.

**idx 10 · kill-XP — HELD, overturn upheld in half.** `NPC.as:218`, `NPC.as:252`,
`EnemyPlayer.as:80-89` all verbatim. The clause *"20+ samples show no XP formula either"* falls.
The clause the blocker is actually about — *coins-per-kill = 8 is an unconfirmed INFERRED seed* —
is untouched; no coin formula appears anywhere in this finding.

**idx 13 · npcdata silences — HELD, all four sub-facts reproduced.** My own parse of all 495
`<npc>` blocks: template rows (no name/ai/lvl) at ids **0 (:3), 47 (:1511), 160 (:3352),
801 (:4097), 819 (:4437)** — line numbers exact; all eight colour/forshow tags = **0** occurrences
while `MCSCharacter.as:524-551` parses every one; bands 0-99=91, 100-199=99, 200-656=285,
800-819=20, **657-799 empty**, zero duplicate ids. Minor correction: rows whose `<name>` is 5001
(`'?'`) are **814-818 — five rows, not four**. The named ledger sentence (items-equipment *Ready*)
is not touched by any of this — though see NEW-4 below, it falls for another reason entirely.

**idx 14 · procgen surnames — HELD, overturn upheld with scope.** Byte-verified at the stated
offsets. Stronger than the finding says: **none** of `Hachisuka`, `Honda`, `Kano`, `Shizuka`,
`Zabuza`, `Hotaru`, `Tengu` appears anywhere in the 2,533-entry string table, so no authored NPC
carries any of them. Two of the four "omitted bosses" dissolve; **Zabuza and Tengu Hotaru survive
as genuine omissions**, so the sentence half-stands.

**idx 15 · 800×480 — HELD, overturn upheld.** Verified in **both** builds:
`shs3_android_payload/scripts/StatsManager.as:80,82,96,98` and
`shs3_payload/scripts/§1t1523s0§.as:104,106`. I also measured the frame myself rather than trusting
the number: `Nr4fQstqHDM_431.0.png` (1920×1080) has non-black content in columns 52…1867 →
**content box 1816×1080, aspect 1.6815, 52 px bars each side**. 5:3 = 1.6667, so the capture is
0.89 % wide. Code and frame agree — **no FRAME-WINS invocation needed here**, and the blocker's
close-path ("read `stage.stageWidth` in a build") was never necessary.

**idx 17 · repair cost — HELD, overturn upheld, parity hole is REAL.** `InteractUI.as:1057-1076`
verbatim: `cost = getCurrentNodeLevel() * 10`, `changeGold(-cost)`, `if(weapon.uses > 1) weapon.uses = 1`.
I checked the web side myself: `"repairweapon"` and `"reinforceweapon"` return **zero hits** in
`shs3_payload/` — and string literals do survive that bundle's obfuscation (e.g. `"/fart"`,
`"/seppuku"` at `§1t113s0§.as:812/851`), so this is a genuine absence, not a grep artifact.
Android-only for now.

**idx 18 · 0x990000 — HELD.** `10027008 == 0x990000`; `10682368 (0xA30000)` returns **zero hits**
across all of `reference/decompiled/`. `src/config/palette.ts:58` already carries `winRed: 0x990000`
and its comment at :55 records the video read as `#a30e00` — i.e. the 0xA30000 figure is a
compressed-video sample, and the authored literal is what the engine draws.

**idx 19 · 6×6 square board — HELD.** Stronger than cited: `WarHexUI.as:175-176` sets
`this.ht = 6; this.wt = 6;`, and **both** layout branches (`:253-254` and `:359-360`) use the same
`x = 90 + xpos*55; y = 92 + ypos*55` with no odd-row offset. Arrows are n/s/e/w only
(`WarHex.as:219-222`). It is a square lattice drawn with hexagon art.

**idx 20/21/22 · friend bar — all three HELD; idx 22's caveat is WRONG.** `GameEngine.as:267-312`
verbatim. I parsed the SWF headers myself rather than trusting the quote:
`reference/decrypted/shs3_android_payload_decoded.swf` → rect **800×480**;
`reference/decrypted/shs3_payload_decoded.swf` → rect **800×690**. ⚠ idx 22 asserts the formula
"exists only in the Android bundle — grep … for originalWidth/originalHeight returns zero hits."
That grep was doomed: `originalWidth` is a **local** variable, and the web bundle renames locals to
`_loc*`. The formula is right there in the web build —
`shs3_payload/scripts/§1t1540s0§.as:269-290`, `var _loc2_:int = 800; var _loc3_:int = 480;
var _loc4_:int = 690;` with the same `<=` aspect branch and the same friend-panel `init()` call.
**Full build parity. Never conclude absence from a grep for an identifier in the obfuscated bundle.**

**idx 23 · anim loop flag — HELD, measurement reproduced exactly.** My own parse over
`reference/extracted/bindata/*.bin` (19 files carrying `<anim>`): **487 `<anim>` total, 102 with
`l="1"`, and 0 cases where `@d` ≠ the `<f>` count** — the claim to the digit. All twelve named
animations exist and loop. ⚠ One decoration is false: *"every `*_partb` slash tail"* loops —
only **18 of 46** `*_partb` anims carry `l="1"` (`spear_lunge_partb`, `heavy_fallslash_partb`,
`flurry_partb`, `lightjumpslash_partb`, `dual_fallslash_partb`… do not). The named ledger sentence
(art *Ready (strongest slice)*) is not falsified by adding a loop flag — the finding makes it more
complete, which is not the same as making it false.

---

## NEW FINDINGS (nobody in this packet claims these)

**NEW-1 · Web v0.717 crit is a flat ×1.3 — the ledger's CRIT_MULT ruling is CONFIRMED, not killed.**
`shs3_payload/scripts/§1t99s0§.as:3272-3276` — `if(reload == maxreload) return maxDamage * 1.3 + STAT_CRITICALDMG;`
A2, web build. REBUILD_READINESS.md:152 stands, now with a payload cite.

**NEW-2 · Web v0.717 per-stance damage multipliers, and the stance table is a mastery-10 ceiling.**
`§1t99s0§.as:3258-3271`: Light `×(0.5 + 0.04·lightMastery)`, Balanced `×(1 + 0.02·balancedMastery)`,
Heavy/Dual/Reversed `×1.4`. skilldata skill 1000 carries ten `<level>` rows (`<required>9</required>`
on level 10). At mastery 10 → **0.90 / 1.20 / 1.40**, i.e. REBUILD_READINESS.md:155's table exactly.
This is the number a rebuild must code, not the android 0.005-per-point curve.

**NEW-3 · The full XP curve L1→L98 is a shipped constant in BOTH builds — ledger :199 is FALSE.**
`shs3_android/scripts/StatsManager.as:78` and `shs3_payload/scripts/§1t1523s0§.as:364` both carry a
99-entry `expArray`, `[0,550,1450,2950,…,29395800]`; index 10 = 31 400 (matches the known L1–L10
caps), index 80 = 4 285 800. REBUILD_READINESS.md:199 — *"② **L11–80 XP curve — likely
unrecoverable** … Keep the extrapolation as labeled INFERRED"* — and §6's "unrecoverable" list are
overturned outright. **This is the single largest un-banked win in the payload.**

**NEW-4 · The paperdoll is 13 slots, not 9 — ledger :82 and :209 both fall.**
`shs3_android/scripts/StatsManager.as:262-286`: `EQ_ARMOR 0, EQ_GLOVES 1, EQ_HAIR 2, EQ_HAT 3,
EQ_HEAD 4, EQ_MASK 5, EQ_NECK 6, EQ_PANTS 7, EQ_SHOES 8, EQ_WEAPON 9, EQ_SCABBARD 10,
EQ_ACCESSORY1 11, EQ_ACCESSORY2 12`. Corroborated by `XMLNpc.as:36`'s 13-field DEFAULT_EQSTRING and
`XMLNpc.as:705` `new Vector.<Item>(13)`. npcdata `<mcs>` uses 12 of them (armor, gloves, hair, hat,
head, mask, neck, pants, shoes, weapon, prop1, prop2). "9-slot paperdoll" is wrong in the ledger's
KNOWN-KNOWNS **and** in items-equipment *Ready*.

**NEW-5 · Skill 1500 = REVERSED stance mastery, 1501 = DUAL stance mastery — A2, both builds.**
`shs3_android_payload/scripts/EnemyPlayer.as:836-843` and `EnemyElite.as:160-166`:
`if(xml.getMastery(1500) > 0) setStance(REVERSED_STANCE); else if(xml.getMastery(1501) > 0)
setStance(DUAL_STANCE);` — same branch in the web build at `shs3_payload/scripts/§1t4906s0§.as:90-95`.
This upgrades idx 7 from a positional inference to a direct functional identification (the display
*names* remain unheld — 1500/1501 have no string-table entry). npcdata carries 1500 on 5 rows and
1501 on 2 rows, all `ai 29` (EnemyElite).

**NEW-6 · Shunpo's real effect is held — skills-meters blocker ② falls.**
`docs/gauntlet/L0/index/resolved_names.json` skilldata 1039: *"Ultimate Light Stance technique.
Hold down the skill icon to increase the damage it inflicts. This skill can only be used when in
Light Stance."* Same shape for 1040 Thousand Stabs (Balanced) and 1041 Deadly Cleave (Heavy).
REBUILD_READINESS.md:195 blocker ② — *"Shunpo's real effect … spacebar-slowmo belongs to SHS2"* —
is closed: it is a hold-to-charge stance ultimate.

**NEW-7 · Heavy Defense ×0.8 is double-confirmed in the target build.**
`§1t99s0§.as:3286-3290` (`if(stance == HEAVY) return defense * 0.8;`) plus skill 1002's own
description *"…Defense -20%"*. The ledger's damage-math line at :74 is now A2-backed.

**NEW-8 · The 800/480/690 resize + friend-panel branch exists in the WEB build.**
`shs3_payload/scripts/§1t1540s0§.as:269-290`. Refutes idx 22's "android-only" caveat and removes the
S0-3 parity flag from the whole friend-bar cluster.

**NEW-9 · The Dragon Dance ring is in the WEB build.** `§1t5495s0§.as:70-71` (both trigram label
arrays, verbatim) and `§1t8695s0§.as:172-212` (the five target permutations). Removes idx 4's
android-only caveat.

**NEW-10 · Method warning for every remaining lane: do not conclude absence from a grep for an
identifier in `shs3_payload/`.** That bundle renames classes, members **and locals** (`§1t…§`,
`_loc*`). Numeric and string **literals** survive. Search for the constants and for the function
*order*, then map the obfuscated names — that is how `§1t99s0§` = MCSPlayer, `§1t1523s0§` =
StatsManager, `§1t1540s0§` = GameEngine, `§1t1541s0§` = InputManager and `§1t5495s0§` = DragonDanceUI
were all established in this session.
