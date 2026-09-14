# LEDGER — the 68 refutations of `wf_99c74d25-624`, adjudicated (harness finish, F3)

> Generated from the adjudication run `wf_6826589c-ae0` (its journal is committed beside this file). **All 534 commands the adjudicators cited were re-executed under `sandbox-exec`, with every write under `/Users` denied, and every quoted output matched real output** ({'MATCH': 534}). The returned results and the adjudicators' on-disk copies were compared and are identical. The verdicts are the adjudicators', each re-derived by command; **every repo change was re-read against the `.as` by hand before it was made** — two chunks proposed different fixes for the same lines and both were partly wrong, so no proposal was applied as written.

| status / category | n |
|---|---|
| CONFIRMED / ALREADY-FIXED | 2 |
| CONFIRMED / COMMITTED-TEXT | 15 |
| CONFIRMED / MEASUREMENT-ONLY | 31 |
| CONFIRMED / TEST-GAP | 1 |
| PARTIAL / COMMITTED-TEXT | 8 |
| PARTIAL / MEASUREMENT-ONLY | 9 |
| PARTIAL / TEST-GAP | 1 |
| REFUTED / MEASUREMENT-ONLY | 1 |

**The kickoff's named items, resolved:**

- *Uniqueness claims* ("the ONLY one of the four that never re-targets") — **CONFIRMED false**: the horse never re-targets either. Corrected in five places.
- *`EnemyHorse.die()` untested; playback and `dontGiveLoot` unpinned* — **CONFIRMED**. Pinned for all four and planted (a guard on the horse's payout; a facing-coin draw in the stag's).
- *The bear's five `canGot*` flags unpinned* — **CONFIRMED**. Pinned through all seven reactions and planted.
- *A JAW hit (kept in `PART_weapon`) runs the base parry* — **CONFIRMED as a fact, NOT a gap in this port**: the base parry is pinned (`tests/npcBase.test.ts:316`, `:384`), the bear's override set (no `gotHit`) is pinned by `tests/npcTree.test.ts`, and the jaw-in-weapon-slot mapping is `MCSBear` display data, which DIVERGENCES records as deliberately not modelled.
- *More drifted cites* — **CONFIRMED, and more than listed**: 74 distinct sites were proposed; the real set was re-derived from the source.
- *Mis-labels ("source bug")* — **MEASUREMENT-ONLY**: `grep -in "source bug"` over the four ports, their configs and the slice test finds nothing; DIVERGENCES already files those items under "ported as they read" and counts one source bug (the stag's dropped `doChase`).

---

### `EnemyBear:override-cite#1` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** F6 (a) adapter note, and F5 detail (the off-stage-player divergence)

**Adjudicated:** The core holds: getNearestEnemy(x, true) also offers the living PLAYER with no stage fence (NPCManager.as:1392-1401), so F6(a) is incomplete, F5's off-stage-player consequence is false, and the only frame-1 difference needs a default-null target. Three details are wrong: friendList has 7 push sites, not 4 (:987, :997 and :1983 push network EnemyPlayers, still never the local player), only 16 call sites pass a literal `true` (21 is all of them), and a friendly at an EQUAL distance also beats the player, so the condition is 'not farther'. The wrong claim is in no live committed file; only the archived gauntlet critic (enemies-ai.hunter.md:254) repeats the truncated range.

**Action:** no committed file carries the statement — nothing to change.

- holds: getNearestEnemy does not end at :1390: lines :1392-1401 add the player whenever isEnemy is true, with no on-stage fence, and it returns at :1402.
  ```
  $ awk 'NR>=1390 && NR<=1403 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPCManager.as
  1390:             }
  1391:          }
  1392:          if(isEnemy)
  1393:          {
  ```
- holds: The measurement read only :1360-1390, and its F6(a) and F5 text says what the refutation quotes.
  ```
  $ sed -n '9p' docs/research/runs/wf-journal-measure-verify-3a-RESUMED-wf_99c74d25-624.jsonl | command grep -o ':1360-1390 (getNearestEnemy)\|(a) the literal `true` selects friendList\|while the port.s bear returns from update having done nothing'
  while the port's bear returns from update having done nothing
  (a) the literal `true` selects friendList
  :1360-1390 (getNearestEnemy)
  ```
- …and 10 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:override-cite#2` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** F7 crash-window threshold ('Reachable only if the BEAR_DEATH clip runs >=95 frames')

**Adjudicated:** Right that it is not a >=95 threshold: with no red-freeze frames only a 96-frame BEAR_DEATH crashes (95 disposes safely in doDying, 97 or more dispose on update 96), and red-freeze pauses ttl but not the clip clock. The general formula 'clip minus red-freeze frames = 96' also needs the finish frame itself to be unfrozen (a 97-frame clip whose last frame is frozen is safe), and the shipped bear_death clip is d="6", so the path is unreachable in real data, which neither agent measured; the wording lives only in the report.

**Action:** no committed file carries the statement — nothing to change.

- holds: TTLMAX is 96, and reset() loads it into ttl.
  ```
  $ awk 'NR==28||NR==208 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  28:       internal var TTLMAX:int = 96;
  208:          this.ttl = this.TTLMAX;
  ```
- holds: deathAnimEnd (:1129-1142) and doDying (:1148-1161) each skip on red freeze, decrement ttl and dispose at <= 0. doDying writes mcs.alpha once ttl < 12. redFreeze() leaves animFrozen false for DYING_STATE.
  ```
  $ awk 'NR==1129||NR==1133||NR==1138||NR==1142||NR==1148||NR==1152||NR==1153||NR==1155||NR==1161||(NR>=1176&&NR<=1178) {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  1129:          if(StageManager.isRedFreeze())
  1133:          --this.ttl;
  1138:          if(this.ttl <= 0)
  1142:             mcs = null;
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:override-cite#3` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F14 cite sweep: missed a drifted cite in the bear's own config

**Adjudicated:** Every sub-claim holds: EnemyBear.as:41 is the reward line, the flip is :42-45, ogEnemyBear.ts:43 carried `:41-44` at 5505a83, and F14 never named that file. d733f88 fixed the config, the port header and the test title, but the same wrong cite survives at docs/DIVERGENCES.md:4727; separately, the adjacent `EnemyStag.as:39-42` has the same one-early drift (the flip is :41-44) at DIVERGENCES.md:4728, ogEnemyStag.ts:14, EnemyStag.ts:13 and npcSlice3a.test.ts:784.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: EnemyBear.as:41 is `reward = ...`, and the !isAdventureMode doChase flip spans :42-45.
  ```
  $ awk 'NR>=41 && NR<=45 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyBear.as
  41:          reward = new XMLReward(xml.reward);
  42:          if(!GameEngine.isAdventureMode())
  43:          {
  44:             this.doChase = true;
  ```
- holds: At the run commit, ogEnemyBear.ts:43 carried the wrong `:41-44`.
  ```
  $ git show 5505a83:src/config/ogEnemyBear.ts | awk 'NR==43 {print NR": "$0}'
  43:    * outside the overworld — `:41-44`) charges a player it can see within 400 px,
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:override-cite#4` — **CONFIRMED** · ALREADY-FIXED

**Refuted:** F2 / F14 claim that the config's cite problems are limited to the bear offStage.dest list and EnemyWolf.as:168

**Adjudicated:** Every sub-claim held at 5505a83: the four ogNpcAnimal.ts cites landed on `}` / POSE / POSE / `break;`, the katana cite was 8 lines off against a ±1 window and was copied into ogEnemyWolf.ts:49 and ogNpcHumanoid.ts:32, and the bear reads offStage.dest 4 times and fallGravity once. d733f88 fixed all of them (:205, :223, :241, :301, now pinned at ±0 in tests/claimcheck.test.ts); the refutation's 'add :261' was rightly not taken, because the dest comment lists the FLEE sites (bear :243/:256, stag :301/:315) and :248/:261 are the doChase charge.

**Action:** already fixed by F1 (`d733f88` / `1637466`).

- holds: At the run commit, ogNpcAnimal.ts carried EnemyKatana.as:213, EnemyDeer.as:224, EnemyHorse.as:242 and EnemyStag.as:302.
  ```
  $ git show 5505a83:src/config/ogNpcAnimal.ts | command grep -n 'EnemyKatana.as:213\|EnemyDeer.as:224\|EnemyHorse.as:242\|EnemyStag.as:302'
  82:   * and of `EnemyKatana.as:213`.
  97:   *   - `dest` `EnemyBear.as:243`/`:248` · `EnemyDeer.as:224`/`:238`
  98:   *     · `EnemyHorse.as:242`/`:250` · `EnemyStag.as:302`/`:307` — fleeing aims 100 px
  ```
- holds: Those four lines are `}`, POSE, POSE and `break;`, not the values.
  ```
  $ awk 'FILENAME~/Deer/&&FNR==224||FILENAME~/Horse/&&FNR==242||FILENAME~/Stag/&&FNR==302||FILENAME~/Katana/&&FNR==213 {print FILENAME":"FNR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as reference/decompiled/shs3_android_payload/scripts/EnemyStag.as reference/decompiled/shs3_android_payload/scripts/EnemyKatana.as
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:224:                }
  reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as:242:                this.startAction(POSE_STATE);
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:302:                this.startAction(POSE_STATE);
  reference/decompiled/shs3_android_payload/scripts/EnemyKatana.as:213:                break;
  ```
- …and 8 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:override-cite#5` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F10 (c) and F14: the 'bite and pounce' cite EnemyWolf.as:294 in the port header and the config

**Adjudicated:** EnemyWolf.as:294 fences only the ATTACK bite (PART_weapon); the CHARGING pounce has its own fence at :310 (PART_head, PART_r_hand), which is cited nowhere, and the one-cite claim is live in THREE files (EnemyBear.ts:18, ogEnemyBear.ts:37, and docs/DIVERGENCES.md:4624, which the refutation missed). The config edit also needs `EnemyWolf.as:310` in claimcheck's CONTEXT allow-list, or the ±0 numeric half flags it NO-VALUE-AT-CITE (the line holds neither 100 nor 120); separately, types.ts:53's 'animals ... do not bite' overstates, since the bear mauls in the overworld, but that is outside this refutation.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: :294 fences the ATTACK bite (PART_weapon), and CHARGING's pounce has a separate fence at :310 (PART_head, PART_r_hand).
  ```
  $ awk 'NR==293||NR==294||NR==296||NR==299||NR==300||NR==310||NR==312||NR==313 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyWolf.as
  293:             case ATTACK_STATE:
  294:                if(!GameEngine.isAdventureMode())
  296:                   target.checkHitObject(mcs.partList[MCSCharacter.PART_weapon],new Damage(damage,level));
  299:             case CHARGING_STATE:
  ```
- holds: The 'bite and pounce (one cite :294)' claim is written in EnemyBear.ts:18, ogEnemyBear.ts:37 and docs/DIVERGENCES.md:4624. types.ts:53 cites it for the bite alone.
  ```
  $ git grep -n 'EnemyWolf.as:294' -- src tests docs/DIVERGENCES.md RESUME_HERE.md
  docs/DIVERGENCES.md:4624:  and pounce both have one (`EnemyWolf.as:294`). A bear mauls in the overworld.
  src/config/ogEnemyBear.ts:37:   * wolf's bite and pounce are both fenced by one (`EnemyWolf.as:294`). A bear
  src/core/npc/EnemyBear.ts:18: *     bite and pounce both have one (`EnemyWolf.as:294`). A bear mauls in the overworld.
  src/core/npc/types.ts:53:  /** `GameEngine.isAdventureMode()` — the overworld: animals wander and do not bite (`EnemyWolf.as:294`). */
  ```
- …and 4 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:override-cite#6` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** counts block: three counts do not match what the commands print

**Adjudicated:** All three recounts are right: 27 digit lines in the port, all comments; 22 nearestEnemy lines (21 call sites plus 1 interface); and 5 test files naming EnemyBear, with npcHarness.test.ts building a bear at :92. The claim that tests/npcHarness.test.ts is UNTRACKED is false: it was committed in a790c82, an ancestor of the run commit, and none of the counts appear in any committed file.

**Action:** no committed file carries the statement — nothing to change.

- holds: `grep -n '[0-9]' src/core/npc/EnemyBear.ts` prints 27 lines, not 25.
  ```
  $ command grep -n '[0-9]' src/core/npc/EnemyBear.ts | wc -l
        27
  ```
- holds: All 27 of those lines are comments: zero lines fail the comment-prefix match.
  ```
  $ command grep -n '[0-9]' src/core/npc/EnemyBear.ts | command grep -v -c '^[0-9]*: *\(\*\|/\*\*\|//\)'
  0
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:override-cite#7` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F8 (3) cite src/config/ogNpcAnimal.ts:26-27

**Adjudicated:** Both parts hold. F8's cite `ogNpcAnimal.ts:26-27` is one line late (the warning is :25-26, :27 is ` */`), which is report-only; and the shared OG_ANIMAL.xp warning names only the stag, although the bear, deer and horse do not override setLevel and inherit the base's `xp = lvl * 2 + 20` (NPC.as:252). That omission is live in ogNpcAnimal.ts:26, and the fix is doc-only because npcSlice3a.test.ts:795 already pins deer == stag after setLevel, xp included.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: The warning sits on ogNpcAnimal.ts:25-26, and :27 is only ` */`.
  ```
  $ awk 'NR>=24 && NR<=28 {print NR": "$0}' src/config/ogNpcAnimal.ts
  24:    *
  25:    * ⚠️ The stag's `setLevel` OVERWRITES this with the BASE curve (`EnemyStag.as:62`), so a
  26:    * levelled stag is worth less than an unlevelled one. The source's, pinned.
  27:    */
  ```
- holds: F8 cited ogNpcAnimal.ts:26-27.
  ```
  $ sed -n '9p' docs/research/runs/wf-journal-measure-verify-3a-RESUMED-wf_99c74d25-624.jsonl | command grep -o 'src/config/ogNpcAnimal.ts:26-27'
  src/config/ogNpcAnimal.ts:26-27
  ```
- …and 4 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:override-cite#8` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** Port header EnemyBear.ts:26 list of unguarded target dereferences

**Adjudicated:** The header's list is drifted and incomplete: EnemyBear.as:212 is `case ATTACK_STATE:` (the deref is :213), and the source also reads `target` unguarded at :147 (ATTACK facing) and :197 (the RUN range check). That makes four sites (:147, :197, :213, :238), all in F4's own evidence, and the claim is written only at src/core/npc/EnemyBear.ts:26.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: EnemyBear.as reads `target` without a guard at :147, :197, :213 and :238. :55 is the guard itself, and :57/:86 are writes.
  ```
  $ command grep -n 'target' reference/decompiled/shs3_android_payload/scripts/EnemyBear.as
  55:         if(target == null || target.isDead())
  57:            target = NPCManager.getNearestEnemy(getMapPosition(),true);
  58:            if(target == null)
  86:            target = NPCManager.getNearestEnemy(getMapPosition(),true);
  ```
- holds: :212 is `case ATTACK_STATE:`, and the dereference is on :213.
  ```
  $ awk 'NR==212||NR==213 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyBear.as
  212:             case ATTACK_STATE:
  213:                target.checkHitObject(mcs.partList[MCSCharacter.PART_r_hand],new Damage(damage,level));
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#1` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F5 + F19: 'the .as's eight statements' / 'init's eight statements in the same order'

**Adjudicated:** True: F19 lists nine names (8 arrows) under 'eight statements', and F5 repeats 'eight'; the .as init body is ten statements counting the empty if at :34-36 (nine without it) and the port's init is exactly nine, one per line at :65-73. The wrong count lives only in the run journal's measurement report; no src/tests/docs file states it. Aside: the separate `:33-35` empty-if cite drift is F9 (unrefuted) and still sits in 3 committed places (ogEnemyHorse.ts:12, EnemyHorse.ts:21, DIVERGENCES.md:4692).

**Action:** no committed file carries the statement — nothing to change.

- holds: F19 labels a nine-name list 'eight statements'
  ```
  $ grep -o "init's eight statements in the same order ([^,]*" docs/research/runs/wf-journal-measure-verify-3a-RESUMED-wf_99c74d25-624.jsonl | head -1
  init's eight statements in the same order (initMCSFromXML → damage → defense → maxhp → level → xp → reset → startAction(IDLE) → reward
  ```
- holds: F5 also says the .as has 'eight statements'
  ```
  $ grep -o "the port's init is the .as's eight statements in the .as's order" docs/research/runs/wf-journal-measure-verify-3a-RESUMED-wf_99c74d25-624.jsonl | head -1
  the port's init is the .as's eight statements in the .as's order
  ```
- …and 4 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#2` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F11: the evidence cite `src/config/ogEnemyHorse.ts:8`

**Adjudicated:** True: in ogEnemyHorse.ts (unchanged since the run) the `(:169-172)` token is on line 7 and line 8 carries `:232-235`, so F11's `ogEnemyHorse.ts:8` is one line late; F9's quote starts on line 11, not 12. Minor: the quoted words end on line 13, so :11-13 is tighter than the proposed :11-14 (14 only finishes the sentence). Both are the report's own cites; no committed file repeats them.

**Action:** no committed file carries the statement — nothing to change.

- holds: `(:169-172)` is on line 7, `:232-235` on line 8, the warning quote starts on 11
  ```
  $ awk 'NR>=7&&NR<=8||NR>=11&&NR<=14{print NR": "$0}' src/config/ogEnemyHorse.ts
  7:  * `else` (`:169-172`) re-enters IDLE, so an un-chased horse grazes forever. Its
  8:  * `checkPlayer()` returns immediately on `!doChase` (`:232-235`) — the only one of
  11:  * ⚠️ `init()` does NOT set `mcs.y = getGroundY()` and has no `doChase = true`
  12:  * adventure branch — the bear (`:41-46`) and the stag (`:39-44`) have both. `:33-35`
  ```
- holds: the report cites ogEnemyHorse.ts:12-14 (F9) and :8 (F11)
  ```
  $ grep -o 'Cited as .\{0,12\} at src/config/ogEnemyHorse.ts:12-14\|Cited at src/config/ogEnemyHorse.ts:8 .\{0,40\}' docs/research/runs/wf-journal-measure-verify-3a-RESUMED-wf_99c74d25-624.jsonl | head -2
  Cited as `:33-35` at src/config/ogEnemyHorse.ts:12-14
  Cited at src/config/ogEnemyHorse.ts:8 — `the \\`else\\` (\\`:169-172\\`) re-en
  ```
- …and 2 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#3` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F11 / counts: the out-of-file drift list names only tests/npcSlice3a.test.ts:677 for the horse's `:154`

**Adjudicated:** True: the horse's doChase fence is EnemyHorse.as:153 and the stag's unfenced if is EnemyStag.as:213, yet test :937 cites `:214` vs `:154`, and the report listed only :677. The refutation is itself incomplete: the same one-line-late fence cites also sit in DIVERGENCES.md:4638/:4641/:4725 and EnemyStag.ts:25/:26 (7 sites total). Proposals change only the fence cite; the `:169-172` range on :677/:4638 is F11's separate drift. EnemyStag.ts:26 gets the file named, because a bare cite in the stag's header reads as EnemyStag.as.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: horse fence `if(... && this.doChase)` is at :153 (154 is its brace)
  ```
  $ awk 'NR>=153&&NR<=154{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as | tr -d '\r'
  153:                   if(!CutsceneManager.getInstance().isShowing() && this.doChase)
  154:                   {
  ```
- holds: stag's unfenced act-roll `if` is at :213 (214 is its brace)
  ```
  $ awk 'NR>=213&&NR<=214{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as | tr -d '\r'
  213:                   if(!CutsceneManager.getInstance().isShowing())
  214:                   {
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#4` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F14: the `:118`/`:130` 'read twice' imprecision is listed only in EnemyHorse.ts:16-17

**Adjudicated:** True: test :737's title says 'read twice, once per direction (`:118`/`:130`)', the same anchor-as-read wording as EnemyHorse.ts:16, which is the only site the report's F14 listed; the two isAdventureMode() reads are :116/:128 and :118/:130 are the room-speed assignments. Low severity (the 15s really are at :118/:130, and ogNpcAnimal.ts:46 cites them correctly for the value). Sibling, not listed as a site: DIVERGENCES.md:4646-4647 says the stag's 'RUN reads isAdventureMode() per direction (15 in a room, 12 outside — `:162`/`:174`)', where the stag's reads are :160/:172 and :162/:174 are only the 15s.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: both committed horse sites use read-wording with :118/:130
  ```
  $ grep -n 'read twice, once per direction\|reads `isAdventureMode()` TWICE' tests/npcSlice3a.test.ts src/core/npc/EnemyHorse.ts
  tests/npcSlice3a.test.ts:737:  it('gallops 15 in a room and 12 in the overworld — read twice, once per direction (`:118`/`:130`)', () => {
  src/core/npc/EnemyHorse.ts:16: *   - **RUN reads `isAdventureMode()` TWICE**, once per direction (`:118`/`:130`):
  ```
- holds: the reads are :116/:128; :118/:130 are the room-speed assignments
  ```
  $ awk 'NR>=116&&NR<=118||NR>=128&&NR<=130{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as | tr -d '\r'
  116:                   if(!GameEngine.isAdventureMode())
  117:                   {
  118:                      walkSpeed = -15;
  128:                   if(!GameEngine.isAdventureMode())
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#5` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F10 / counts: the DIVERGENCES.md:4671 doChase drift

**Adjudicated:** True: DIVERGENCES.md:4672 cites the stag's initialiser-less doChase as `:9` but it is EnemyStag.as:10, and EnemyStag.ts:47/49/51 cite :5/:7/:9 for fields at :6/:8/:10; the report's F10 named only EnemyBear.ts. Still incomplete: the same `(:9)` is in EnemyStag.ts:11, and EnemyDeer.ts:35/37 (:5/:7 for :6/:8) make it all four ports, so the -1 field cite is slice-wide. Sites list every instance in HEAD, including F10's own horse and bear ones. No commit since the run touched these files.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: fields are declared at :6/:8/:10 in all four .as files (deer has no doChase)
  ```
  $ grep -n 'internal var' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as reference/decompiled/shs3_android_payload/scripts/EnemyBear.as | tr -d '\r'
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:6:      internal var destX:int;
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:8:      internal var idleCounter:int;
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:10:      internal var doChase:Boolean;
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:6:      internal var destX:int;
  ```
- holds: the cited stag lines :5/:7/:9 are blank
  ```
  $ awk 'NR==5||NR==7||NR==9{gsub(/[ \r]/,"");print NR": ["$0"]"}' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  5: []
  7: []
  9: []
  ```
- …and 4 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#6` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F15: 'kept in step by the same seam in both … So screen x = posX − stagePosition always'

**Adjudicated:** True: the source keeps screen x = map x - scroll across a scroll only because NPCManager.doScroll (:1171-1202) shifts mcs.x for the enemy, friend and neutral lists (StageManager.as:486/:492/:1033). src/ has no doScroll and never changes stagePosition after setPosition; every test world pins it to 0. The report never mentions doScroll, so its 'always' is an overclaim. No committed text is false (types.ts:43 and MCSActor.ts:44/127 only define the relation), but the gap is recorded nowhere ('doScroll' has 0 hits in src/tests/docs). Closing it would be a behaviour change or a new DIVERGENCES seam entry.

**Action:** no committed file carries the statement — nothing to change.

- holds: doScroll shifts mcs.x for all three NPC lists
  ```
  $ awk 'NR==1171||NR==1181||NR==1190||NR==1199{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPCManager.as | tr -d '\r'
  1171:       public static function doScroll(dist:int) : *
  1181:                mcs.x -= dist;
  1190:                mcs.x -= dist;
  1199:                mcs.x -= dist;
  ```
- holds: StageManager calls it whenever the stage position moves
  ```
  $ grep -n 'NPCManager.doScroll' reference/decompiled/shs3_android_payload/scripts/StageManager.as | tr -d '\r'
  486:            NPCManager.doScroll(room.getWidth() - StatsManager.stageWidth);
  492:            NPCManager.doScroll(playerNewXPos - StatsManager.stageWidth / 2);
  1033:         NPCManager.doScroll(-dist);
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#7` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** counts: 'Of those 9, three are unreachable for this actor (GOTLAUNCHED, FALL, LAND — see F6/F7)'

**Adjudicated:** True: of the nine doAction cases, five are unreachable for a horse. GOTLAUNCHED sits behind canGotLaunched=false; DOWNED is written only in doLaunched (NPC.as:715), which only the dead GOTLAUNCHED case calls; FALL is written only by the base init the horse overrides (NPC.as:226); LAND is written only inside FALL (EnemyHorse.as:220). No reachable code writes ATTACK: NPC.as/MCSActor.as never do, the other writers are subclasses' own this.startAction, the network variable-state calls target EnemyPlayer, and the only external constant DOWNED write is on the player. ATTACK and DOWNED are empty in both files. The 'three' is report-only.

**Action:** no committed file carries the statement — nothing to change.

- holds: the horse's doAction has 9 cases
  ```
  $ sed -n '143,228p' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as | grep 'case ' | tr -d '\r'
              case IDLE_STATE:
              case WALK_STATE:
              case RUN_STATE:
              case ATTACK_STATE:
  ```
- holds: ATTACK and DOWNED cases are empty in the .as
  ```
  $ awk 'NR>=207&&NR<=213{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as | tr -d '\r'
  207:             case ATTACK_STATE:
  208:                break;
  209:             case GOTLAUNCHED_STATE:
  210:                doLaunched();
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:override-cite#8` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F2: 'grep -n walkSpeed|isAdventureMode EnemyHorse.as gives :116 … :134'

**Adjudicated:** True: `grep -n 'walkSpeed\|isAdventureMode' EnemyHorse.as` prints 11 lines (103, 108, 116, 118, 122, 128, 130, 134, 174, 189, 200), but F2 quotes six as the command's output. The report mentions :103/:108 later in the same paragraph, but never :174/:189/:200. No count or committed text depends on it.

**Action:** no committed file carries the statement — nothing to change.

- holds: the command prints 11 lines
  ```
  $ grep -n 'walkSpeed\|isAdventureMode' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as | tr -d '\r'
  103:                  walkSpeed = -3;
  108:                  walkSpeed = 3;
  116:                  if(!GameEngine.isAdventureMode())
  118:                     walkSpeed = -15;
  ```
- holds: F2 presents six lines as that command's output
  ```
  $ python3 -c "import json;r=json.loads(open('docs/research/runs/wf-journal-measure-verify-3a-RESUMED-wf_99c74d25-624.jsonl').read().splitlines()[11])['result'];f=[x for x in r['findings'] if x['id']=='F2'][0];d=f['detail'];i=d.find('gives');print(d[i:i+190])"
  gives `:116 if(!GameEngine.isAdventureMode())`, `:118 walkSpeed = -15;`, `:122 walkSpeed = -12;`, `:128 if(!GameEngine.isAdventureMode())`, `:130 walkSpeed = 15;`, `:134 walkSpeed = 12;`. NO
  ```

### `EnemyHorse:override-cite#9` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F3: 'The source's target is never null in practice: NPC.as:91 … runs in the base constructor'

**Adjudicated:** True: NPC.as:265 (setIsFriendly) sets target from getNearestEnemy, which starts at null and returns null when no enemy is on stage. Its only caller, createFriend (NPCManager.as:892), builds the horse through createNPC at :555 with no arguments, so doChase=false and checkPlayer returns at EnemyHorse.as:232-235 before reading target at :236. createRoomNPC (:694) never calls it. The third writer, changeTarget (NPC.as:1202), has no caller at all. Nuance: F3's literal 'never null in practice' is false for a friend horse; what holds is that the null is never dereferenced, which is what the correction says.

**Action:** no committed file carries the statement — nothing to change.

- holds: target writers in NPC.as: ctor :91, setIsFriendly :265, changeTarget :1202
  ```
  $ grep -n 'this.target = ' reference/decompiled/shs3_android_payload/scripts/NPC.as | tr -d '\r'
  91:         this.target = StatsManager.getPlayer();
  265:         this.target = NPCManager.getNearestEnemy(getMapPosition(),!this.isFriendly);
  1202:         this.target = npc;
  ```
- holds: getNearestEnemy starts at null and a friend (isEnemy=false) skips the player fallback
  ```
  $ awk 'NR==1367||NR==1368||NR==1370||NR==1392||NR==1402{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPCManager.as | tr -d '\r'
  1367:          var selectedEnemy:NPC = null;
  1368:          if(!isEnemy)
  1370:             targetList = enemyList;
  1392:          if(isEnemy)
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#1` — **PARTIAL** · TEST-GAP

**Refuted:** F8 (and F4): the horse's die() is called 'pinned', both through the ledger cite and through the port header's 'each pinned in tests/npcSlice3a.test.ts'

**Adjudicated:** Core holds: no test calls EnemyHorse.die() (npcSlice3a is the only importer and its three die() calls sit in the bear, deer and stag blocks), no slice-3a test or plant turns playback on or touches dontGiveLoot, and no plant anchors on any die() line, so DIVERGENCES.md:4613-4614 'each of these is pinned' is false for the horse's die() and for the :4665 isPlayback/dontGiveLoot clause in all four. Wrong part: the port header's 'each pinned' (EnemyHorse.ts:9) lists four OTHER differences and never calls die() pinned, and :228 makes no pinning claim. Adding the test+plant below makes the ledger sentence true, so no doc edit is needed once it lands.

**Action:** **pinned and chaos-planted** in `f4e4ec2`.

- holds: Only tests/npcSlice3a.test.ts imports EnemyHorse, so no other test can reach its die().
  ```
  $ git grep -n "core/npc/EnemyHorse'" -- tests scripts src
  tests/npcSlice3a.test.ts:29:import { EnemyHorse } from '../src/core/npc/EnemyHorse';
  ```
- holds: In npcSlice3a.test.ts die() is called only at 474 (bear block), 666 (deer block) and 973 (stag block); the horse block (676-772) calls none.
  ```
  $ git grep -n -E '\.die\(\)|^describe\(' -- tests/npcSlice3a.test.ts
  tests/npcSlice3a.test.ts:177:describe('slice 3a config — the shared animal numbers, and the twins that must not drift', () => {
  tests/npcSlice3a.test.ts:265:describe('EnemyBear — the only fighter of the four', () => {
  tests/npcSlice3a.test.ts:474:    a.die();
  tests/npcSlice3a.test.ts:507:describe('EnemyDeer — pure prey, and the only one that never re-targets', () => {
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#2` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F4: "NO_DICE ... stands for 'no blood dice were rolled' ... (the base's dice at NPC.as:941/:983 drive the emitters)"

**Adjudicated:** True: the death event's dice is the roll that chose the clip (types.ts:151, Npc.ts:30-32, Npc.ts:704/727 -> :739; NPC.as:1005 *7 and :1096 *5), the placement rolls at :941/:983 are never rolled by any port, and NO_DICE is right for the horse only because EnemyHorse.as:257-266 has no Math.random. The 'no blood dice' reading exists only in the measurement report. Aside, outside this refutation: Npc.ts:30's list of unrolled emitter dice omits NPC.as:1020 (the DEFEATED2 branch's int(Math.random()*2) neck/stomach pick), which the port also does not roll.

**Action:** no committed file carries the statement — nothing to change.

- holds: The seam documents dice as the roll that chose anim.
  ```
  $ sed -n '151p' src/core/npc/types.ts
        /** `die()` chose a death. `dice` is the roll that chose `anim` (−1 when no roll). */
  ```
- holds: Npc.ts says the blood-emitter placement dice are NOT rolled and the death event carries the clip roll.
  ```
  $ sed -n '30,32p' src/core/npc/Npc.ts
   *   - blood-emitter placement dice (`:941`, `:983`, `:1032`, `:1054`) are NOT
   *     rolled: they only place particles. The `death` event carries the roll
   *     that chose the clip; the render side owns the blood.
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#3` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F5/F6/F7/F8 labelled 'SOURCE BUG, PORTED AS IT READS', and F5's 'so this is a confirmed, pinned source bug'

**Adjudicated:** True: the ledger files the elemental and die() items under 'PORTED AS THEY READ — the four against each other', the slice heading counts ONE source bug (the stag constructor), the wolf keeps playDie (EnemyWolf.as:449) while all four animals drop it, and no animal roster row carries fire/earth, so nothing shows these are bugs. No committed file calls them source bugs (HARNESS_FINISH_KICKOFF.md:121-122 already records the mislabel). Nuance: the elemental item IS pinned (test :230 + plant :205), so only 'source bug' in F5's phrase is wrong, not 'pinned'.

**Action:** no committed file carries the statement — nothing to change.

- holds: The slice heading counts one source bug; the elemental/die() items sit under PORTED AS THEY READ; the one source-bug section is the stag constructor.
  ```
  $ sed -n '4591p;4611p;4668,4670p' docs/DIVERGENCES.md
  ## LANE L4b (slice 3a) — THE FOUR WANDERERS: FOUR ANIMALS THAT LOOK LIKE ONE AND ARE NOT. TWO FINDINGS ADDED, ONE SOURCE BUG PORTED AS IT READS (2026-09-12)
  ### ⚠️ PORTED AS THEY READ — the four against each other
  ### ⚠️ A SOURCE BUG, PORTED AS IT READS — and why it never bit
  
  ```
- holds: Only the wolf of these five classes calls playDie.
  ```
  $ awk '/playDie/ {print FILENAME":"FNR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyWolf.as reference/decompiled/shs3_android_payload/scripts/EnemyBear.as reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  reference/decompiled/shs3_android_payload/scripts/EnemyWolf.as:449:          SoundManager.instance.playDie();
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#4` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** F8's list of what the horse's die() drops ('no death sound, no playback guard, no launch or downed branch'; 'a horse dies silently')

**Adjudicated:** Holds (single-player; netcode can replicate any state): the launch, downed and SEPPUKU branches are dead for a horse (every canGot* false guards every NPC.as writer of GOTLAUNCHED/DOWNED/KNOCKDOWNED/FLY/VICTIM), dontGiveLoot is dead (only CutsceneActor, EnemyClone, EnemyPlayer, MCSPlayer set it, on themselves; reset() clears it), the base's facing-flip roll (NPC.as:966) and clip roll (:1005/:1096) are live deltas nobody lists, and the killing hit still plays playHit (:444 test before :460 damage, :516), with HP lowered only in gotHit. Not quite: F7 names only GOTLAUNCHED, DOWNED and FLY, not KNOCKDOWNED/VICTIM (those are dead by canGotKnockDown/canGotKneeGroin instead). In the tree, 'dies silently' is measurement-only and the four port headers' 'no launch or downed branch' is literally true, but DIVERGENCES.md:4665-4666 lists the dead branches as a live delta ('a bear killed mid-launch' cannot happen: EnemyBear.as:24) and omits the two live ones.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: A horse sets every canGot* false and overrides none of the got* reaction functions.
  ```
  $ awk 'NR>=24 && NR<=28 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as; awk '/function /{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as
  24:          canGotLaunched = false;
  25:          canGotKnockDown = false;
  26:          canGotFly = false;
  27:          canGotKneeGroin = false;
  ```
- holds: Every writer of GOTLAUNCHED/KNOCKDOWNED/FLY/VICTIM in NPC.as returns first on the matching canGot* flag (DOWNED is written only by doLaunched, reached only from GOTLAUNCHED).
  ```
  $ awk 'NR==538||NR==572||NR==587||NR==613||NR==641||NR==660||NR==715 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  538:          if(!this.canGotLaunched || this.isDowned() && !actionState == FLY_STATE || actionState == DYING_STATE)
  572:          if(!this.canGotKnockDown || this.isDowned() || actionState == DYING_STATE)
  587:          if(!this.canGotFly || this.isDowned() || actionState == DYING_STATE)
  613:          if(!this.canGotFly || this.isDowned() || actionState == DYING_STATE)
  ```
- …and 13 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#5` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** F18: "`case OG_ANIM.HORSE_REARING: this.startAction(OG_STATE.RUN)` is the only path out of POSE"

**Adjudicated:** Core holds: canHit() tests only gotHitCounter and gotHit has no actionState test before damage, so a rearing (POSE) horse can take a lethal hit and die() writes DYING (EnemyHorse.as:262 / EnemyHorse.ts:233), a second exit from POSE; the rear-clip finish stays the only POSE->RUN path. Not exact: gotHit has a second early return (:440, a weapon-part hit), so 'only early return' is wrong, and neither F18 nor the correction is exhaustive, since Obj_NPCAggro.as:211 can also force REDFREEZE on its createRoomNPC actor (which includes ai 12). 'Only path out of POSE' is not written in any committed file.

**Action:** no committed file carries the statement — nothing to change.

- holds: die() writes DYING directly, in the source and the port.
  ```
  $ awk 'NR==262 {print "EnemyHorse.as:"NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as; awk 'NR==233 {print "EnemyHorse.ts:"NR": "$0}' src/core/npc/EnemyHorse.ts
  EnemyHorse.as:262:          actionState = DYING_STATE;
  EnemyHorse.ts:233:     this.actionState = OG_STATE.DYING;
  ```
- holds: gotHit reads no actionState before applying damage (:386-460).
  ```
  $ awk 'NR>=386 && NR<=460 && /actionState|return/ {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  390:             return false;
  440:                return false;
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#6` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F5 detail and F19: init is 'the .as's eight statements'

**Adjudicated:** True: leaving out the empty if, EnemyHorse.as init has nine statements (:33, :37-44) and EnemyHorse.ts:65-73 has nine, and F19 itself lists nine while saying 'eight'. The miscount appears only in the measurement (F5 and F19); no committed file says 'eight statements'.

**Action:** no committed file carries the statement — nothing to change.

- holds: EnemyHorse.as:32-44 holds nine executable statements (the empty if at :34-36 has none).
  ```
  $ awk 'NR>=32 && NR<=44 && /;/ {c++; print NR": "$0} END {print "statements with ; in EnemyHorse.as:32-44 = " c+0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as
  33:          initMCSFromXML(xml.mcs);
  37:          damage = xml.attack;
  38:          defense = xml.defense;
  39:          maxhp = xml.hp;
  ```
- holds: The port's init body has nine statements too.
  ```
  $ awk 'NR>=65 && NR<=73 && /;/ {c++; print NR": "$0} END {print "statements with ; in EnemyHorse.ts:65-73 = " c+0}' src/core/npc/EnemyHorse.ts
  65:     this.initMCSFromXML(xml.mcs);
  66:     this.damage = xml.attack ?? ZERO;
  67:     this.defense = xml.defense ?? ZERO;
  68:     this.maxhp = xml.hp ?? ZERO;
  ```
- …and 2 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#7` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F11 cite: 'Cited at src/config/ogEnemyHorse.ts:8'

**Adjudicated:** True: the `:169-172` token is on src/config/ogEnemyHorse.ts:7 (line 8 holds `:232-235`), both at HEAD and at the run's commit 5505a83, while F11 cites line 8. The off-by-one is only in the report; the drifted `:169-172` cite itself is committed text and is listed under reception#8.

**Action:** no committed file carries the statement — nothing to change.

- holds: At HEAD, line 7 holds `:169-172` and line 8 holds `:232-235`.
  ```
  $ awk 'NR==7||NR==8 {print NR": "$0}' src/config/ogEnemyHorse.ts
  7:  * `else` (`:169-172`) re-enters IDLE, so an un-chased horse grazes forever. Its
  8:  * `checkPlayer()` returns immediately on `!doChase` (`:232-235`) — the only one of
  ```
- holds: The file is unchanged since the run, so the measurement's line 8 was wrong when made.
  ```
  $ git show 5505a83:src/config/ogEnemyHorse.ts | awk 'NR==7||NR==8 {print NR": "$0}'
  7:  * `else` (`:169-172`) re-enters IDLE, so an un-chased horse grazes forever. Its
  8:  * `checkPlayer()` returns immediately on `!doChase` (`:232-235`) — the only one of
  ```
- …and 2 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyHorse:reception#8` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** counts: the 'Outside the four files, the same drift sits in ...' list

**Adjudicated:** True: the measurement's 'outside the four files' list names only ogNpcAnimal:98, DIVERGENCES 4655/4671/4692 and test:677, yet the same drifted cites sit at DIVERGENCES 4638/4643/4725, test:937 and EnemyStag.ts:26 (horse if at :153, else :166-169; stag if at :213, grounding at :45). The stag `:214` drift also sits at DIVERGENCES:4641 and EnemyStag.ts:25, which the refutation did not name. All 13 current sites are below (HARNESS_FINISH_KICKOFF.md:119 describes the fix and is left out). Adjacent, not this claim: DIVERGENCES:4727-4728 still carries `EnemyBear.as:41-44` (F1 fixed it elsewhere; the flip is :42-45) and stag `:39-42` (flip at :41-44), as do ogEnemyStag.ts:14, EnemyStag.ts:13 and test:784.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: The horse's fence is at :153 (:154 is its brace) and the else re-entering IDLE is :166-169 (:169-172 are braces, checkPlayer, break).
  ```
  $ awk '(NR>=153 && NR<=154) || (NR>=166 && NR<=172) {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as
  153:                   if(!CutsceneManager.getInstance().isShowing() && this.doChase)
  154:                   {
  166:                   else
  167:                   {
  ```
- holds: The stag's init spans reward :40 to grounding :45 (so `:39-44` misses the ground line), and its unfenced act-roll if is :213 (:214 is the brace).
  ```
  $ awk '(NR>=39 && NR<=45) || (NR>=213 && NR<=214) {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  39:          this.startAction(IDLE_STATE);
  40:          reward = new XMLReward(xml.reward);
  41:          if(!GameEngine.isAdventureMode())
  42:          {
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#1` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** F9 (detail: 'gotHit's whole reaction ladder no-ops for it, and it only ever loses HP') and F1 (lists gotHit as 'NOT overridden' without saying what the inherited body does to an animal)

**Adjudicated:** Every substantive claim holds: MCSBear keeps its jaw in PART_weapon (MCSBear.as:62/:75), the bear inherits NPC.gotHit, whose PART_weapon arm (NPC.as:437-440) returns before damage, the 12-frame i-frames (:462) and playHit (:516); EnemyWolf.gotHit (:373-378) doubles and beheads on that same slot; head/neck have art and take the x1.5 behead (:451-454); the port's switch (Npc.ts:337-339) is faithful and the base parry is pinned (npcBase.test.ts:316). The one evidence line that fails: `grep -rn -i jaw src tests` returns TWO unrelated hits (ogActor.ts:107 'ninJAWalk' as well), not only svgShape.test.ts:499. The false wording ('it only ever loses HP') lives only in the run journals, not in src/tests/docs, so nothing to change in the repo. Caveat to add to the correction: the jaw 'deflect' is per contact point, since NPCManager's slash loop keeps testing later points while gotHitFlag is false (:1266), so one parried point does not void a whole swing.

**Action:** no committed file carries the statement — nothing to change.

- holds: MCSBear extends MCSAnimal and keeps its jaw clip in PART_weapon
  ```
  $ grep -n "class MCSBear\|jaw:MovieClip = partList\|\"jaw_\"" reference/decompiled/shs3_android_payload/scripts/MCSBear.as
  5:   public class MCSBear extends MCSAnimal
  62:         var jaw:MovieClip = partList[PART_weapon];
  75:         componentObject = getMCSComponent("jaw_" + animalName + "_",id);
  ```
- holds: Neither EnemyBear.as nor the port declares or calls gotHit, so the bear runs the base NPC.gotHit
  ```
  $ grep -cw "gotHit" reference/decompiled/shs3_android_payload/scripts/EnemyBear.as src/core/npc/EnemyBear.ts | LC_ALL=C sort
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:0
  src/core/npc/EnemyBear.ts:0
  ```
- …and 11 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#2` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F12 (3) detail: 'the source's bear ignores behead entirely'

**Adjudicated:** True. NPCManager.checkDie reads `enemy.behead` for both enemyList (:1685-1690) and neutralList (:1698-1703, where the room dispatch pushes bears at :744) and adds it to totalBeheading (:1714), which GameEngine reports as achievement stat 60016 (:1172); the slash path reaches checkDie at :1296. EnemyBear.die() never touches behead, and gotHit clears it only when the bear survives (NPC.as:464-466), so a lethal head/neck hit on a bear counts as a beheading. The port's death event carries behead (Npc.ts:663). 'ignores behead entirely' is only in the run journal, so no committed text to change.

**Action:** no committed file carries the statement — nothing to change.

- holds: checkDie counts enemy.behead on both lists, and the room dispatch pushes a bear onto neutralList
  ```
  $ awk 'NR==744||NR>=1685&&NR<=1689||NR>=1698&&NR<=1702||NR==1714{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPCManager.as
  744:          neutralList.push(actor);
  1685:             if(!enemy.isDead() && enemy.checkDie())
  1686:             {
  1687:                if(enemy.behead)
  ```
- holds: GameEngine reports the beheading total as achievement stat 60016
  ```
  $ awk 'NR==1172{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/GameEngine.as
  1172:                StatsManager.reportAchievementStat(60016,NPCManager.getTotalBeheading());
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#3` — **CONFIRMED** · TEST-GAP

**Refuted:** F9 immunity claim ('the bear is therefore immune to launch, knockdown, fly, fly-away, knee-groin, back-throw AND stun')

**Adjudicated:** True. The bear's five canGot* = false (EnemyBear.as:24-28) make every base reaction return (NPC.as:538/572/587/613/641/660/680), and the port copies all five (EnemyBear.ts:59-63), but no test reads a bear's canGot* flags or drives a bear through a launch/knockdown/stun hit: the only `canGot` text in any test file that imports EnemyBear is a comment (npcSlice3a.test.ts:197) plus four plant anchors that target EnemyStag.ts and EnemyDeer.ts. The grep lists in the evidence reproduce exactly. A one-line flags assertion (the same shape npcSlice2a.test.ts:170 uses for the wolf) plus a plant flipping canGotKnockDown closes it.

**Action:** **pinned and chaos-planted** in `f4e4ec2`.

- holds: The test files that mention canGotLaunched/KnockDown/Stun/KneeGroin are exactly those six, none of them npcSlice3a.test.ts
  ```
  $ grep -rln "canGotLaunched\|canGotKnockDown\|canGotStun\|canGotKneeGroin" tests | LC_ALL=C sort
  tests/chaosGate.test.ts
  tests/npcBase.test.ts
  tests/npcSlice2a.test.ts
  tests/npcSlice3a.plants.ts
  ```
- holds: npcSlice3a.test.ts mentions canGot only in a comment at :197
  ```
  $ grep -n "canGot" tests/npcSlice3a.test.ts
  197:    // All four set only their `canGot*` flags and (bear, horse) `doChase`; the
  ```
- …and 8 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#4` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F7 detail ('Reachable only if the BEAR_DEATH clip runs ≥95 frames') and INFERRED item (a)

**Adjudicated:** True. bear_death is d="6" and AnimData adds nothing for it (duration = @d, no bear_death case), so the crash path is unreachable for the bear. The threshold arithmetic also holds: with TTLMAX 96, doDying running on every earlier clip frame and deathAnimEnd decrementing on the finishing frame, ttl hits 0 inside deathAnimEnd only at D = 96 (simulated: 95 disposes cleanly on update 95, 97+ dispose on update 96 before the clip ends, and update's `mcs == null` guard stops the rest); red-freeze pauses both decrements. F7's '≥95 frames' is wrong but lives only in the run journal.

**Action:** no committed file carries the statement — nothing to change.

- holds: The bear's death clip lasts 6 frames
  ```
  $ grep -o '<anim i="bear_death"[^>]*>' reference/extracted/android/92_MCSCharacter_BearAnimationData.bin
  <anim i="bear_death" d="6">
  ```
- holds: A clip's duration is its d attribute
  ```
  $ awk 'NR==15{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/AnimData.as
  15:          this.duration = xml.@d;
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#5` — **REFUTED** · MEASUREMENT-ONLY

**Refuted:** F5 detail ('with the player off-stage the source's bear still has a target and runs doAction, while the port's bear returns from update having done nothing')

**Adjudicated:** The refutation's core claim is false. It holds that reset zeroes aiCounter (NPC.as:203), that frame 1's checkAITrigger fires and re-arms it at 24 (:287-291, :22), and that the port returns before its own checkAITrigger (EnemyBear.ts:86 before :107). But getNearestEnemy(pos, true) does NOT return null for an off-stage player: the stage filter (:1382) sits inside the friendList loop (:1378-1391), and the player is checked AFTER that loop with no stage test (:1392-1398). So the source bear re-acquires the player on frame 1 and keeps acting; it does not 'stall from frame 2'. F5's conclusion (the source bear keeps a target) survives, though its own cited mechanism (:1382) is also misapplied: that filter never touches the player, and a faithful nearestEnemy adapter would return a live off-stage player too, so the port bear would not idle either. Report-only text; nothing committed claims a stage filter on the player.

**Action:** no committed file carries the statement — nothing to change.

- holds: reset() zeroes aiCounter, and the bear's init calls reset()
  ```
  $ awk 'NR==203||NR==204{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  203:          this.aiCounter = 0;
  204:          this.startAction(IDLE_STATE);
  ```
- holds: The bear calls reset at :39 and re-targets with isEnemy=true at :57 and :86
  ```
  $ awk 'NR==39||NR==57||NR==86{print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyBear.as
  39:          reset();
  57:             target = NPCManager.getNearestEnemy(getMapPosition(),true);
  86:             target = NPCManager.getNearestEnemy(getMapPosition(),true);
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#6` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F8 (1) consequence: 'a bear pays loot and XP during a replay and even when a spawner set dontGiveLoot'

**Adjudicated:** True. Every `dontGiveLoot = true` in the scripts is an unqualified self-write inside CutsceneActor, EnemyClone, EnemyPlayer or MCSPlayer (none is EnemyBear or its ancestor chain beyond NPC), no manager writes it on another actor, and NPC.reset() clears it (NPC.as:199). So for a bear only the playback half of the missing guard is observable. The committed text (DIVERGENCES.md:4665) says only 'no isPlayback / dontGiveLoot guard', which is true; the 'spawner set dontGiveLoot' wording is report-only.

**Action:** no committed file carries the statement — nothing to change.

- holds: Every dontGiveLoot write outside NPC.as is a bare self-assignment in CutsceneActor, EnemyClone, EnemyPlayer or MCSPlayer
  ```
  $ grep -rn "dontGiveLoot" reference/decompiled/shs3_android_payload/scripts | LC_ALL=C sort
  reference/decompiled/shs3_android_payload/scripts/CutsceneActor.as:29:         dontGiveLoot = true;
  reference/decompiled/shs3_android_payload/scripts/EnemyClone.as:800:            dontGiveLoot = true;
  reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:1283:         if(dontGiveLoot && controlledBy == 2)
  reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:1309:         if(dontGiveLoot && controlledBy == 2)
  ```
- holds: None of the writers is a bear: EnemyBear extends NPC directly; the writers are CutsceneActor and the MCSPlayer chain
  ```
  $ grep -n "public class" reference/decompiled/shs3_android_payload/scripts/EnemyClone.as reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as reference/decompiled/shs3_android_payload/scripts/CutsceneActor.as reference/decompiled/shs3_android_payload/scripts/EnemyBear.as | LC_ALL=C sort
  reference/decompiled/shs3_android_payload/scripts/CutsceneActor.as:5:   public class CutsceneActor extends NPC
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:3:   public class EnemyBear extends NPC
  reference/decompiled/shs3_android_payload/scripts/EnemyClone.as:6:   public class EnemyClone extends EnemyPlayer
  reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:5:   public class EnemyPlayer extends MCSPlayer
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#7` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** counts block: '`grep -n '[0-9]' src/core/npc/EnemyBear.ts` returns 25 lines' and '`grep -rn "nearestEnemy" src` → 20 lines: 19 call sites + 1 interface'

**Adjudicated:** True, and the counts were already wrong at the run's own commit: EnemyBear.ts has 27 digit-bearing lines at both HEAD and 5505a83 (not 25), every one a comment (0 lines survive filtering out comment starts), and `grep -rn nearestEnemy src` gives 22 lines (not 20): 21 call sites plus the types.ts:56 interface, 0 adapters. The evidence's '(all lines 2-26 of the header' means the 14 digit lines inside 2-26, not all 25 lines. Both conclusions stand; the wrong numbers are report-only.

**Action:** no committed file carries the statement — nothing to change.

- holds: 27 digit-bearing lines at HEAD
  ```
  $ grep -n '[0-9]' src/core/npc/EnemyBear.ts | wc -l
        27
  ```
- holds: 27 at the run's commit 5505a83 too, so the report's 25 was never right
  ```
  $ git show 5505a83:src/core/npc/EnemyBear.ts | grep -n '[0-9]' | wc -l
        27
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyBear:reception#8` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F14 (cite-drift sweep)

**Adjudicated:** True at 5505a83 (ogEnemyBear.ts:43 read `:41-44`; EnemyBear.as:41 is `reward = ...`, the flip is :42-45), and that config site is ALREADY FIXED at HEAD (now line 44, `:42-45`). The sweep is still incomplete, though: docs/DIVERGENCES.md:4727 still cites `EnemyBear.as:41-44` (RESUME_HERE.md:9's 'fixed in F1' missed it), and three comments cite the bear's flip+ground block as `:41-46` where it is :42-46 (line 41 is the reward). Sites below change only the bear numbers. Adjacent drift NOT proposed here (stag/horse units): the stag's init cites `:39-42` (4 sites) and `:39-44` (3 sites) are two lines early (flip EnemyStag.as:41-44, ground :45), and ogEnemyHorse.ts:12's `:33-35` empty if is really EnemyHorse.as:34-36.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: At the run's commit the bear config cited `:41-44`
  ```
  $ git show 5505a83:src/config/ogEnemyBear.ts | sed -n 43p
     * outside the overworld — `:41-44`) charges a player it can see within 400 px,
  ```
- holds: At HEAD that config site already reads `:42-45` (ALREADY-FIXED part)
  ```
  $ grep -n "outside the overworld — " src/config/ogEnemyBear.ts
  44:   * outside the overworld — `:42-45`) charges a player it can see within 400 px,
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#1` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** F22 (the deer is unique in never re-targeting and never re-checking while running), plus the same claim in src/core/npc/EnemyDeer.ts:5-7, src/config/ogEnemyDeer.ts:6-8 and the describe title at tests/npcSlice3a.test.ts:507

**Adjudicated:** The core claim is right. The horse's update() also has no target re-acquire and no checkAITrigger() (only the bear and stag have them), and all four animals call checkPlayer only from IDLE and WALK, never inside RUN. So 'the ONLY one of the four' is false. The refutation is wrong only about scope: it names three sites, but there are five. It missed docs/DIVERGENCES.md:4629 ('Only the deer never re-acquires') and ogEnemyDeer.ts:8 ('checkPlayer() reads that target every frame', which is false for RUN frames).

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: Only the bear and the stag re-acquire a target or call checkAITrigger(); EnemyDeer.as and EnemyHorse.as have no such line
  ```
  $ grep -n 'checkAITrigger\|getNearestEnemy' reference/decompiled/shs3_android_payload/scripts/EnemyBear.as reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as reference/decompiled/shs3_android_payload/scripts/EnemyStag.as | LC_ALL=C sort
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:57:            target = NPCManager.getNearestEnemy(getMapPosition(),true);
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:84:         if(checkAITrigger())
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:86:            target = NPCManager.getNearestEnemy(getMapPosition(),true);
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:114:         if(checkAITrigger())
  ```
- holds: All four call checkPlayer() only before their doAction RUN case (IDLE + WALK), never inside it
  ```
  $ awk 'FNR==1{n=0} /case RUN_STATE:/{n++; if(n==2){r=FNR}} n==2 && FNR>r && /case [A-Z_]+_STATE:/{print FILENAME": doAction RUN case "r"-"FNR-1; n=3} /this\.checkPlayer\(\);/{print FILENAME":"FNR": checkPlayer call"}' reference/decompiled/shs3_android_payload/scripts/EnemyBear.as reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:178: checkPlayer call
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:193: checkPlayer call
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as: doAction RUN case 195-211
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:155: checkPlayer call
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#2` — **CONFIRMED** · ALREADY-FIXED

**Refuted:** F16 ("ONE cite off by one" in OG_ANIMAL)

**Adjudicated:** Every sub-claim holds. At 5505a83 these cites were wrong: EnemyDeer.as:224, EnemyHorse.as:242 and EnemyStag.as:302 (each one line past its `+ 100` line), EnemyKatana.as:213 (8 lines off, in 3 files) and EnemyWolf.as:168. Claimcheck ran at ±1 then, which is why the three off-by-one cites passed. The commits since 5505a83 corrected all of them, plus the tests/npcSlice3a.test.ts:185 copy of :168 that the refutation missed. None is left in src at HEAD, and claimcheck's window is now 0.

**Action:** already fixed by F1 (`d733f88` / `1637466`).

- holds: The old cited lines are not the claimed statements (POSE_STATE, a brace, a break, an else)
  ```
  $ awk '(FILENAME ~ /EnemyHorse.as$/ && FNR==242) || (FILENAME ~ /EnemyStag.as$/ && FNR==302) || (FILENAME ~ /EnemyDeer.as$/ && FNR==224) || (FILENAME ~ /EnemyKatana.as$/ && FNR==213) || (FILENAME ~ /EnemyWolf.as$/ && FNR==168) {print FILENAME":"FNR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as reference/decompiled/shs3_android_payload/scripts/EnemyStag.as reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyKatana.as reference/decompiled/shs3_android_payload/scripts/EnemyWolf.as
  reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as:242:                this.startAction(POSE_STATE);
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:302:                this.startAction(POSE_STATE);
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:224:                }
  reference/decompiled/shs3_android_payload/scripts/EnemyKatana.as:213:                break;
  ```
- holds: The `+ 100` flee lines are deer :223, horse :241, stag :301
  ```
  $ grep -n 'getGameStageWidth() + 100;' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as reference/decompiled/shs3_android_payload/scripts/EnemyStag.as | LC_ALL=C sort
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:223:                  this.destX = StageManager.getGameStageWidth() + 100;
  reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as:241:               this.destX = StageManager.getGameStageWidth() + 100;
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:301:               this.destX = StageManager.getGameStageWidth() + 100;
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:321:               this.destX = StageManager.getGameStageWidth() + 100;
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#3` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F19 (behead part indices, 46 unreachable clips, UNVERIFIED which bank holds the art)

**Adjudicated:** Holds. Hat, head and neck are indices 17, 16 and 12; index 3 is the weapon slot, which returns false and does no damage. Three push loops of 23 make 69 clips, but the hit scan covers 22 of them (21..0), leaving 47, not 46. MCSAnimal's setters write only first-bank indices 0-20, all inside the scan, so a head or neck hit on a deer takes the ×1.5 behead path. One slip: 'at or below 22' is loose, because index 22 is not scanned, but no setter uses it (the highest is 20). F19's wrong wording is only in the committed run journals.

**Action:** no committed file carries the statement — nothing to change.

- holds: PART_weapon=3, PART_neck=12, PART_head=16, PART_hat=17
  ```
  $ grep -n 'PART_weapon:int\|PART_neck:int\|PART_head:int\|PART_hat:int' reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as
  16:      public static var PART_weapon:int = 3;
  34:      public static var PART_neck:int = 12;
  42:      public static var PART_head:int = 16;
  44:      public static var PART_hat:int = 17;
  ```
- holds: hat/head/neck behead; weapon returns false with damage 0; behead is ×1.5 at :453
  ```
  $ awk '(NR>=431 && NR<=440) || NR==453 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  431:             case mcs.partList[MCSCharacter.PART_hat]:
  432:             case mcs.partList[MCSCharacter.PART_head]:
  433:             case mcs.partList[MCSCharacter.PART_neck]:
  434:                behead = true;
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#4` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** F10 ("FIVE of the deer's ten doAction cases"; "A deer can only ever hold IDLE / WALK / RUN / DYING / REDFREEZE"), and the counts line "5 of 10"

**Adjudicated:** True: doAction has 9 cases in both source and port, not 10, and the 5 dead cases really are dead. False: FLINCH is not reachable for a deer. NPC.doFlinch has no canGot* gate, but every call in the source is a self-call inside EnemyClone, EnemyPlayer, EnemyShield or MCSPlayer. No call targets another object, and nothing in src calls doFlinch. So F10's list (IDLE/WALK/RUN/DYING/REDFREEZE) was right on this point. F11 only said 'reachable in principle', so the self-contradiction charge does not stand. Nothing committed repeats either wording.

**Action:** no committed file carries the statement — nothing to change.

- holds: doAction has 9 case labels in EnemyDeer.as:130-212 and in EnemyDeer.ts:143-207
  ```
  $ awk 'NR>=130 && NR<=212' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as | grep -c 'case '; awk 'NR>=143 && NR<=207' src/core/npc/EnemyDeer.ts | grep -c 'case '
  9
  9
  ```
- holds: NPC.doFlinch has no canGot* gate
  ```
  $ awk 'NR>=747 && NR<=757 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  747:       public function doFlinch() : *
  748:       {
  749:          if(actionState == FLINCH_STATE || actionState == SLASH_STATE)
  750:          {
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#5` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F13 ("the overridden state, the fresh destX roll, walkSpeed and facing are all set and then discarded"; "does nothing forever")

**Adjudicated:** Holds. startAction(REDFREEZE) only records the state, and startAnim(DEER_IDLE) only swaps the clip without touching scaleX. So the facing set by the coin's startAction stays on screen: a WALK roll faces its new destX, and an IDLE roll keeps the RUN facing. destX, walkSpeed and idleCounter keep their values unused, and the RNG draws are spent. die() and gotHit have no state gate, and unRedFreeze only clears animFrozen, so a parked deer stays parked until it is killed. The port runs in the same order. F13's wording is only in the run journals.

**Action:** no committed file carries the statement — nothing to change.

- holds: On arrival the coin's startAction(IDLE/WALK) runs first, then the off-stage REDFREEZE + DEER_IDLE
  ```
  $ awk 'NR>=174 && NR<=188 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as
  174:                if(Math.abs(this.destX - posX) < 10)
  175:                {
  176:                   if(int(Math.random() * 2) == 0)
  177:                   {
  ```
- holds: startAction writes actionState, faces only in WALK/RUN, and has no REDFREEZE case (switch ends at DYING)
  ```
  $ awk 'NR<=128 && /actionState = actionState|faceLeft|faceRight|case [A-Z_]+:/ {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as
  53:                case DEER_DEATH:
  56:                case DEER_GRAZING:
  57:                case DEER_FIDGET:
  60:                case DEER_GETUP:
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#6` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F9 cite, and the header's 'siblings' framing

**Adjudicated:** Holds. The false header text is at EnemyDeer.ts:12-13, and that file is unchanged since the run, so 13-14 was wrong then too. The horse and stag tick idleCounter only inside IDLE, unguarded, exactly like the deer; only the bear differs. All three re-arm the counter to 24 once it reaches 0, so none ever goes negative. The refutation only re-cites, but the false text is still committed: EnemyDeer.ts:12-13 says the counter 'runs negative', and DIVERGENCES.md:4619-4620 says theirs 'pass through zero'.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: The header's false bullet is at EnemyDeer.ts:12-13
  ```
  $ grep -n 'THREE differences\|UNGUARDED\|floors it at zero' src/core/npc/EnemyDeer.ts
  9: * THREE differences from its siblings, each pinned in `tests/npcSlice3a.test.ts`:
  12: *   - **`idleCounter` ticks UNGUARDED, inside IDLE only** (`:135`), so it runs
  13: *     negative where the bear's `> 0` guard floors it at zero.
  ```
- holds: EnemyDeer.ts is unchanged since 5505a83, so :12-13 was the right cite at run time too
  ```
  $ git diff --name-only 5505a83 HEAD -- src/core/npc/EnemyDeer.ts src/config/ogEnemyDeer.ts | awk 'END{print NR}'
  0
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#7` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** counts block (literal grep, emitDeath, health-bar setters) and F7's 'all six animal ports'

**Adjudicated:** True: the literal grep prints 14 lines, not 13. The emitDeath grep's 13 lines are 1 declaration plus 12 calls in 8 files; 7 of those files are animals, all emit (NO_DICE, false), and Wolf and WolfAlpha also emit (NO_DICE, true). The health-bar grep also prints the variable setter at MCSCharacter.as:1456, inside moveHealthBarY, which nothing calls. False (1): 'SEVEN animal ports'. src/core/npc has nine: EnemyFox and EnemyWolf2 extend EnemyWolf and inherit its emitting die(). F7's 'six' likely meant slice 3's six, and all six emit. False (2): `grep -rn "'death'" src/` prints three lines, not two; it also hits types.ts:152. That line is a type, not a consumer, so F7's no-consumer point stands. Nothing committed carries F7's counts.

**Action:** no committed file carries the statement — nothing to change.

- holds: The stated literal grep hits 14 lines
  ```
  $ grep -n '48\|120\|24\|-3\|walkSpeed = \|= -12\|= 12\|200\|50\|100\|level \* 5' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as | cut -d: -f1 | tr '\n' ' '
  35 79 87 96 104 109 117 122 138 184 219 223 234 238 
  ```
- holds: grep -c agrees: 14
  ```
  $ grep -c '48\|120\|24\|-3\|walkSpeed = \|= -12\|= 12\|200\|50\|100\|level \* 5' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as
  14
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#8` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F15 / F16 'the header's prose ... check out' — prose errors they missed in the config the deer uses and in the port

**Adjudicated:** All three errors are real and committed. 120 against 48 is 2.5×, not four times. At OG_FPS 24, the 24-frame retry is one second, not half a second (ogNpcBase.ts reads 24 frames as ONE SECOND, and 12 frames correctly as half a second). The .as rolls the d4 at :78 and sets the duration at :79, and the port does the same at :99/:100, so the duration comes after the roll, not before. Each wording appears nowhere else.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: ogEnemyDeer.ts:13-14 says 'four times as long' while longFrames is 120
  ```
  $ grep -n 'hold four\|times as long\|longFrames: 120\|five seconds' src/config/ogEnemyDeer.ts
  13:   * `:78` — entering IDLE rolls a d4 for the clip, and two of the four hold four
  14:   * times as long: `:80` 0 → DEER_IDLE, `:84` 1 → DEER_GRAZING, `:89` 2 →
  20:    /** `:87`/`:96` — GRAZING and SIT hold for five seconds. */
  21:    longFrames: 120,
  ```
- holds: ogNpcAnimal.ts:68 says 'half a second' for idleRetryFrames 24, while idleFrames 48 is 'two seconds'
  ```
  $ grep -n 'idleFrames: 48\|idleRetryFrames: 24\|half a second\|two seconds' src/config/ogNpcAnimal.ts
  68:   * — when an idle times out, the next re-roll is half a second away.
  70:  idleRetryFrames: 24,
  74:   * — two seconds of standing about. The deer's GRAZING and SIT override it
  77:  idleFrames: 48,
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:override-cite#9` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F15 / F24 cite of asInt, and F24's grep evidence

**Adjudicated:** Holds. asInt's return line is MCSActor.ts:36, and :35 is the signature. The stated literal grep exits 0 with 8 hits, not 1. All 8 hits are comment lines, and with comment lines filtered out it exits 1, so the zero-literal claim itself stands. The only committed MCSActor cite, DIVERGENCES.md:4881 `:35-37`, is correct, so the mis-cite is only in the report.

**Action:** no committed file carries the statement — nothing to change.

- holds: asInt: signature :35, return :36
  ```
  $ awk 'NR>=34 && NR<=37 {print NR": "$0}' src/core/npc/MCSActor.ts
  34: /** AS3 `int` coercion: truncate toward zero; NaN and ±Infinity become 0. */
  35: export function asInt(n: number): number {
  36:   return Number.isFinite(n) ? Math.trunc(n) : ZERO;
  37: }
  ```
- holds: The stated grep hits 8 lines, all comments (2,4,6,13,15,17,18,210)
  ```
  $ grep -nE '(=|\(|\*|\+|-| )[0-9]+' src/core/npc/EnemyDeer.ts | cut -c1-40
  2: * `EnemyDeer.as` (261 lines), ported 
  4: * Pure prey. It has no ATTACK body at
  6: * `update()` (`:42-69`) neither re-ac
  13: *     negative where the bear's `> 0
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#1` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F22 (and the committed claims it certifies: src/core/npc/EnemyDeer.ts:5-7, src/config/ogEnemyDeer.ts:6-7, tests/npcSlice3a.test.ts:507)

**Adjudicated:** True: the horse's update() (EnemyHorse.as:47-74) also neither re-acquires nor calls checkAITrigger, and all four wanderers call checkPlayer only inside IDLE/WALK, so neither deer trait is unique; the 'ONLY one of the four' claim is committed at EnemyDeer.ts:5, ogEnemyDeer.ts:6, the describe title npcSlice3a.test.ts:507, and also DIVERGENCES.md:4629 (a site the refutation missed), with ogEnemyDeer.ts:8 overstating checkPlayer as 'every frame'. The refutation's alternative 'add the horse as a positive case' already exists at npcSlice3a.test.ts:563 (count(horse) toBe 0), so only the wording needs fixing.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: The horse's update() (EnemyHorse.as:47-74) contains no checkAITrigger, no getNearestEnemy and no target read at all.
  ```
  $ awk 'NR>=47&&NR<=74' reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as | grep -c 'checkAITrigger\|getNearestEnemy\|target'
  0
  ```
- holds: Of the four .as files only the bear and the stag re-acquire / call checkAITrigger; the deer and the horse have neither.
  ```
  $ grep -n 'checkAITrigger\|getNearestEnemy' reference/decompiled/shs3_android_payload/scripts/EnemyBear.as reference/decompiled/shs3_android_payload/scripts/EnemyStag.as reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:57:            target = NPCManager.getNearestEnemy(getMapPosition(),true);
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:84:         if(checkAITrigger())
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:86:            target = NPCManager.getNearestEnemy(getMapPosition(),true);
  reference/decompiled/shs3_android_payload/scripts/EnemyStag.as:80:            target = NPCManager.getNearestEnemy(getMapPosition(),true);
  ```
- …and 8 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#2` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F19 — part indices for the behead path, and the UNVERIFIED about which bank holds the art

**Adjudicated:** True: the behead parts are PART_hat 17 / PART_head 16 / PART_neck 12 (index 3 is PART_weapon, the parry return; index 2 is PART_l_lowarm, which MCSAnimal uses as a front leg), MCSAnimal writes the deer's art into partList[PART_*] of the first bank, and every deer animation node id is <=20, inside the 21..0 hit scan, so a head/neck hit sets behead and a killing one carries behead:true into the port's death event. One imprecision: the x1.5 sits inside getHP()>0 before HP is subtracted, so it applies to the killing hit too, not only 'a hit it survives'; the F19 wording exists only in the run journals.

**Action:** no committed file carries the statement — nothing to change.

- holds: PART indices: l_lowarm 2, weapon 3, neck 12, head 16, hat 17.
  ```
  $ grep -n 'PART_l_lowarm:int\|PART_weapon:int\|PART_neck:int\|PART_head:int\|PART_hat:int' reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as
  14:      public static var PART_l_lowarm:int = 2;
  16:      public static var PART_weapon:int = 3;
  34:      public static var PART_neck:int = 12;
  42:      public static var PART_head:int = 16;
  ```
- holds: gotHit's behead switch keys on hat/head/neck, weapon returns false; x1.5 (:451) is inside getHP()>0 (:444) before HP is subtracted, and behead is reset only when HP stays >0 (:464-466).
  ```
  $ awk 'NR>=430&&NR<=467 && /case mcs.partList|behead|getHP\(\) > 0|return false/ {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  431:             case mcs.partList[MCSCharacter.PART_hat]:
  432:             case mcs.partList[MCSCharacter.PART_head]:
  433:             case mcs.partList[MCSCharacter.PART_neck]:
  434:                behead = true;
  ```
- …and 10 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#3` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** F11 — doFlinch reachability and the 'until endFlinch()' consequence

**Adjudicated:** Holds: every doFlinch() call is a bare self-call in EnemyClone/EnemyPlayer/EnemyShield/MCSPlayer (none is or extends EnemyDeer), endFlinch is called only at EnemyShield.as:119 and MCSPlayer.as:741, EnemyDeer.as never mentions FLINCH, and the port has no caller either, so FLINCH is unreachable for a deer. Does not hold: 'would stay in FLINCH permanently' — the deer's die() sets actionState = DYING_STATE unconditionally (EnemyDeer.as:254), so a killing hit still takes it out. No committed deer text mentions flinch.

**Action:** no committed file carries the statement — nothing to change.

- holds: Every doFlinch()/endFlinch() call in the source is a bare or this.-qualified self-call; endFlinch is called only at EnemyShield.as:119 and MCSPlayer.as:741.
  ```
  $ grep -rn 'doFlinch()\|endFlinch()' reference/decompiled/shs3_android_payload/scripts | sed 's#reference/decompiled/shs3_android_payload/scripts/##' | LC_ALL=C sort
  EnemyClone.as:296:                     doFlinch();
  EnemyClone.as:506:                  doFlinch();
  EnemyClone.as:911:               doFlinch();
  EnemyPlayer.as:1591:               doFlinch();
  ```
- holds: None of the calling classes is or extends EnemyDeer.
  ```
  $ grep -n 'public class' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyClone.as reference/decompiled/shs3_android_payload/scripts/EnemyShield.as reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as reference/decompiled/shs3_android_payload/scripts/EnemyZombie.as
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:3:   public class EnemyDeer extends NPC
  reference/decompiled/shs3_android_payload/scripts/EnemyClone.as:6:   public class EnemyClone extends EnemyPlayer
  reference/decompiled/shs3_android_payload/scripts/EnemyShield.as:5:   public class EnemyShield extends NPC
  reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:5:   public class EnemyPlayer extends MCSPlayer
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#4` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F10 / counts 'UNREACHABLE doAction CASES = 5 of 10'

**Adjudicated:** True: EnemyDeer.as doAction has 9 cases and no default (the port has the same 9), REDFREEZE appears only as a startAction in RUN, and 5 (ATTACK, GOTLAUNCHED, DOWNED, FALL, LAND) are unreachable, leaving IDLE/WALK/RUN/DYING. Its caller survey left out ConnectionPIO.as:591/599 (getNetworkEnemyPlayer, like NetworkManager) and Obj_NPCAggro/ProcGen/Civilian (REDFREEZE/IDLE only), but none of them changes the conclusion. The '5 of 10' count appears only in the measurement report.

**Action:** no committed file carries the statement — nothing to change.

- holds: The .as doAction switch has 9 case labels.
  ```
  $ awk 'NR>=130&&NR<=212' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as | grep -c 'case .*_STATE:'
  9
  ```
- holds: The port's doAction has the same 9.
  ```
  $ awk 'NR>=143&&NR<=207' src/core/npc/EnemyDeer.ts | grep -c 'case OG_STATE'
  9
  ```
- …and 6 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#5` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F7 / counts 'all six animals pass (NO_DICE, false)'

**Adjudicated:** True: EnemyWolf.ts:355 and EnemyWolfAlpha.ts:475 call emitDeath(NO_DICE, true) on the isDowned branch, mirroring EnemyWolf.as:457-462 and EnemyWolfAlpha.as:552-557, while the bear, boar, deer, horse and stag only ever pass false. The report's 'six animals' was also a miscount, since seven animal ports exist, and a deer's death event does carry behead (Npc.ts:663). The false 'all animals pass false' line is in no committed file.

**Action:** no committed file carries the statement — nothing to change.

- holds: Port emitDeath calls: wolf and wolf alpha pass true on one branch; bear/boar/deer/horse/stag pass only false.
  ```
  $ grep -rn 'emitDeath' src/core/npc/ | LC_ALL=C sort
  src/core/npc/EnemyBear.ts:257:    this.emitDeath(NO_DICE, false);
  src/core/npc/EnemyBoar.ts:290:    this.emitDeath(NO_DICE, false);
  src/core/npc/EnemyDeer.ts:244:    this.emitDeath(NO_DICE, false);
  src/core/npc/EnemyHorse.ts:235:    this.emitDeath(NO_DICE, false);
  ```
- holds: EnemyWolf.as die() has an isDowned branch (:457) that enters DYING and returns before the grounded path.
  ```
  $ awk 'NR>=447&&NR<=462 && /function die|isDowned|DYING_STATE|return/ {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyWolf.as
  447:       override public function die() : *
  455:             return;
  457:          if(isDowned())
  459:             actionState = DYING_STATE;
  ```
- …and 4 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#6` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F3 — 'SOURCE BUG ... the deer takes full unresisted elemental damage'

**Adjudicated:** True: npcdata.xml has exactly one ai-19 row (id 74), and it has no fire/wind/water/earth tag (nor do the horse, bear or stag rows, ids 68/72/75). XMLNpc's STAT_* fields default to 0 and are set only when a tag exists (:194/:199/:204/:209), so NPC.init's eight copies would also give 0 and the omission changes nothing on the shipped roster. Two small notes: row 74 spans :1987-2011, not :1987-2006, and DIVERGENCES.md:4662's 'row that really does carry fire and earth' is the bear's row with the tags injected (npcSlice3a.test.ts:233), an optional clarity edit rather than a false claim. The 'source bug' label is only in the report.

**Action:** no committed file carries the statement — nothing to change.

- holds: Exactly one ai-19 row in the roster.
  ```
  $ grep -c '<ai>19</ai>' reference/extracted/npcdata.xml
  1
  ```
- holds: That row is id 74 and spans :1987-2011 (the refutation's :1987-2006 stops 5 lines short; immaterial).
  ```
  $ awk 'NR>=1987&&NR<=1993 {print NR": "$0} NR>1993 && /<\/npc>/ {print NR": "$0; exit}' reference/extracted/npcdata.xml
  1987: 	<npc>
  1988: 		<id>74</id>
  1989: 		<name>5069</name>
  1990: 		<lvl>8</lvl>
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#7` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** counts 'NUMERIC LITERALS IN THE PORT … = 0 (command exited 1, no match)'

**Adjudicated:** True: the report's grep matches 8 lines of EnemyDeer.ts (2, 4, 6, 13, 15, 17, 18, 210) and exits 0, so 'exited 1, no match' is false; all 8 are comment lines, so the purity conclusion (0 code lines with a literal) stands. Even the report's 'minus cite text' qualifier does not rescue it: line 17 matches on plain prose ('200 px'). The wording lives only in the archived run journals, and EnemyDeer.ts is unchanged since 5505a83.

**Action:** no committed file carries the statement — nothing to change.

- holds: The report's command, as written, matches 8 lines and exits 0 at HEAD
  ```
  $ grep -nE '(=|\(|\*|\+|-| )[0-9]+' src/core/npc/EnemyDeer.ts; echo exit=$?
  2: * `EnemyDeer.as` (261 lines), ported — ai 19, no children. Lane L4b, slice 3a.
  4: * Pure prey. It has no ATTACK body at all (`:191-192` is an empty case that only
  6: * `update()` (`:42-69`) neither re-acquires a dead target nor calls
  13: *     negative where the bear's `> 0` guard floors it at zero.
  ```
- holds: Every one of those matches is a comment line (first non-space char is *), so 0 code lines carry a literal
  ```
  $ grep -nE '(=|\(|\*|\+|-| )[0-9]+' src/core/npc/EnemyDeer.ts | grep -cvE '^[0-9]+: *\*'
  0
  ```
- …and 2 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#8` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** counts 'DEER NUMERIC LITERALS IN SOURCE … = 13 hit lines'

**Adjudicated:** True: the report's pattern hits 14 lines of EnemyDeer.as (35 79 87 96 104 109 117 122 138 184 219 223 234 238), and the report's own list has those same 14 entries while its label says 13. The '13 hit lines' count appears only in the archived run journals.

**Action:** no committed file carries the statement — nothing to change.

- holds: grep -c over the pattern prints 14
  ```
  $ { grep -c '48\|120\|24\|-3\|walkSpeed = \|= -12\|= 12\|200\|50\|100\|level \* 5' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as; } | tr -d '\r'
  14
  ```
- holds: The 14 hit lines are 35 79 87 96 104 109 117 122 138 184 219 223 234 238
  ```
  $ { grep -n '48\|120\|24\|-3\|walkSpeed = \|= -12\|= 12\|200\|50\|100\|level \* 5' reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as | cut -d: -f1 | paste -sd' ' -; } | tr -d '\r'
  35 79 87 96 104 109 117 122 138 184 219 223 234 238
  ```
- …and 2 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#9` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F5 — consequence of the two dropped guards

**Adjudicated:** True on every point: dontGiveLoot is set true only inside EnemyClone/MCSPlayer/EnemyPlayer/CutsceneActor (none in the deer's NPC-direct hierarchy) and cleared by reset(), so that dropped guard is inert for ai 19; GameEngine.isPlayback() is also true for ACTION_CUTSCENE, which is genuinely reachable (DuelModeUI.as:474 passes 13), so the deer pays loot+XP in a playback OR a cutscene. The narrow 'playback' wording is F5's only; committed text says 'no isPlayback / dontGiveLoot guard' (DIVERGENCES.md:4665), which is accurate. Adjacent, not false: types.ts:51 glosses isPlayback() as 'replays pay no loot or XP', which omits cutscenes.

**Action:** no committed file carries the statement — nothing to change.

- holds: dontGiveLoot is set true at exactly four sites: EnemyClone.as:800, MCSPlayer.as:3965, EnemyPlayer.as:1452, CutsceneActor.as:29
  ```
  $ { grep -rn "dontGiveLoot = true" reference/decompiled/shs3_android_payload/scripts/; } | tr -d '\r'
  reference/decompiled/shs3_android_payload/scripts/EnemyClone.as:800:            dontGiveLoot = true;
  reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3965:            dontGiveLoot = true;
  reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:1452:            dontGiveLoot = true;
  reference/decompiled/shs3_android_payload/scripts/CutsceneActor.as:29:         dontGiveLoot = true;
  ```
- holds: None of those four classes is an ancestor of EnemyDeer, which extends NPC directly, so nothing sets the flag on a deer
  ```
  $ { grep -n "class .* extends" reference/decompiled/shs3_android_payload/scripts/CutsceneActor.as reference/decompiled/shs3_android_payload/scripts/EnemyClone.as reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as; } | tr -d '\r'
  reference/decompiled/shs3_android_payload/scripts/CutsceneActor.as:5:   public class CutsceneActor extends NPC
  reference/decompiled/shs3_android_payload/scripts/EnemyClone.as:6:   public class EnemyClone extends EnemyPlayer
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:3:   public class EnemyDeer extends NPC
  reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:5:   public class EnemyPlayer extends MCSPlayer
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#10` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F9 cites, and a second false comment it missed

**Adjudicated:** All sub-claims hold: F9's header cite should be EnemyDeer.ts:12-13 and its bear cite EnemyBear.as:161 (163/165 were right); EnemyDeer.ts:142 repeats the false 'not floored' idea, since :136-138 re-arms the counter to 24 on the same tick it reaches <= 0; and the IDLE-only unguarded tick is shared by the horse (:149-152) and stag (:209-212), so it separates the deer from the bear only. The refutation MISSED two more copies of the same false claim: EnemyBear.ts:13 ('never goes negative where the deer's does') and DIVERGENCES.md:4620 ('theirs pass through zero'). EnemyDeer.ts and DIVERGENCES.md are unchanged since 5505a83; no test asserts the false half.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: The false header claim sits at EnemyDeer.ts:12-13 (not 13-14), and :142 repeats it
  ```
  $ sed -n '12,13p;142p' src/core/npc/EnemyDeer.ts
   *   - **`idleCounter` ticks UNGUARDED, inside IDLE only** (`:135`), so it runs
   *     negative where the bear's `> 0` guard floors it at zero.
    /** `EnemyDeer.as:130` — the counter ticks only in IDLE, and is not floored at zero. */
  ```
- holds: F9 cited 'EnemyDeer.ts:13-14' and '162: override internal function doAction'
  ```
  $ grep -o 'EnemyDeer.ts:13-14 asserts\|162:      override internal function doAction' docs/research/runs/wf-journal-measure-verify-3a-DEAD-wf_99c74d25-624.jsonl | sort | uniq -c
     1 162:      override internal function doAction
     1 EnemyDeer.ts:13-14 asserts
  ```
- …and 8 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#11` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** MISSED by F15: ogEnemyDeer.ts:20 and EnemyDeer.ts:14 — 'GRAZING and SIT hold for five seconds' / 'two of its four idle clips hold five seconds'

**Adjudicated:** Holds: grazing (d=62) and fidget (d=23) are non-looping clips whose finish arm (:56-58) re-rolls IDLE before their 120/48 timers run out, SIT (d=12) has no finish arm and waits out 120, so 'GRAZING and SIT hold for five seconds' is false for a fresh GRAZING; and ogNpcAnimal.ts:68's 'half a second' for 24 frames is wrong at OG_FPS 24 (one second). Overclaimed: 'the 120 at :87 and 48 at :79 never expire' / 'only SIT holds 120' -- when the re-roll picks the SAME clip, startAnim(same key) is a no-op (MCSCharacter.as:1282-1285, ported at MCSActor.ts:160), the finished clip never re-fires, and the timer DOES expire (a frozen last frame for 120/48). The refutation also missed ogEnemyDeer.ts:13-14 ('hold four times as long' -- 120/48 is 2.5, and GRAZING does not hold). The port matches the source; tests use a single-duration fake AnimLibrary, so no src behaviour change is implied.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: Committed text claims GRAZING holds: ogEnemyDeer.ts:13-14 ('four times as long'), :20 ('five seconds') and EnemyDeer.ts:14
  ```
  $ sed -n '13,14p;20p' src/config/ogEnemyDeer.ts; sed -n '14p' src/core/npc/EnemyDeer.ts
     * `:78` — entering IDLE rolls a d4 for the clip, and two of the four hold four
     * times as long: `:80` 0 → DEER_IDLE, `:84` 1 → DEER_GRAZING, `:89` 2 →
      /** `:87`/`:96` — GRAZING and SIT hold for five seconds. */
   *   - **two of its four idle clips hold five seconds** (`:87`/`:96`), and rising
  ```
- holds: Payload clip data: deer_grazing d=62, deer_fidget d=23, deer_sit d=12 and deer_death d=7 carry no l (non-looping)
  ```
  $ { grep -ao '<anim i="deer_[a-z]*"[^>]*>' reference/extracted/android/100_MCSCharacter_DeerAnimationData.bin; } | tr -d '\r'
  <anim i="deer_idle" d="1" l="1">
  <anim i="deer_fidget" d="23">
  <anim i="deer_walk" d="22" l="1">
  <anim i="deer_run" d="13" l="1">
  ```
- …and 8 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyDeer:reception#12` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** Minor cite and quote drift in F15/F24, F18 and F8

**Adjudicated:** All three slips are real and live only in the report: asInt's return is MCSActor.ts:36 (35 is the signature); ogAi.ts:139 is the room row with line 706 (only :105 is 576); and Npc.ts:753 fades only under OG_NPC_FADE_FRAMES (12), so 96 (TTLMAX) is the corpse lifetime, not a fade. Nuance: ttl is loaded to TTLMAX by reset() (NPC.as:208), not by die(); it counts down from die() because the deer's DYING doAction calls doDying every update, and deathAnimEnd adds one extra tick on update 7 (deer_death d=7, non-looping), so it reaches 0 on update 95 barring red-freeze frames. No committed file carries '96-frame fade' or a MCSActor.ts:35 return cite (DIVERGENCES.md:4881's `:35-37` range is correct). Adjacent drift the refutation did not raise: ogNpcBase.ts:29 says TTLMAX runs 'from the death anim ending to disposal', but the deer's countdown starts at die(), so only 88 updates remain once its 7-update clip ends (by the model check above).

**Action:** no committed file carries the statement — nothing to change.

- holds: MCSActor.ts:35 is the asInt signature and :36 the quoted return
  ```
  $ sed -n '35,36p' src/core/npc/MCSActor.ts
  export function asInt(n: number): number {
    return Number.isFinite(n) ? Math.trunc(n) : ZERO;
  ```
- holds: The report cited the return at MCSActor.ts:35 (twice: F15 and F24)
  ```
  $ grep -o 'MCSActor.ts:35 `return Number[^`]*`' docs/research/runs/wf-journal-measure-verify-3a-DEAD-wf_99c74d25-624.jsonl | sort | uniq -c
     2 MCSActor.ts:35 `return Number.isFinite(n) ? Math.trunc(n) : ZERO;`
  ```
- …and 9 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:reception#1` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F8: evidence sentence about LAND_STATE, and the claim 'A stag that lands never acts again' labelled a live SOURCE BUG

**Adjudicated:** All three sub-claims hold: EnemyStag.as:288 IS `break;` (F8's 'break is absent' sentence is wrong); the FALL/LAND/GOTLAUNCHED/DOWNED arms are unreachable for a stag (init never calls NPC.init's FALL write, gotLaunched returns on canGotLaunched=false, DOWNED only follows doLaunched, and no class ever puts ANOTHER actor into these states); and updateAnimation reports a non-looping clip's end regardless of actionState, so 'nothing ever finishes' is too strong. One refinement to the correction's optional wording: die() (:332) is a second exit, so 'LAND's ONLY exit' should read 'its only anim-driven exit'. F8's wording exists only in the run journals; no src/test/doc states the LAND claim, so nothing in the repo changes.

**Action:** no committed file carries the statement — nothing to change.

- holds: EnemyStag.as:287 is `case LAND_STATE:`, :288 is `break;`, :289 is `case DYING_STATE:` - the break F8 called absent is there
  ```
  $ awk 'NR>=287&&NR<=289{printf "%d\t%s\n", NR, $0}' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  287	            case LAND_STATE:
  288	               break;
  289	            case DYING_STATE:
  ```
- holds: EnemyStag.init replaces NPC.init without calling it - the stag's only `super` is the constructor's `super()`
  ```
  $ grep -n "super\|function init" reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  14:         super();
  30:      override public function init(xml:XMLNpc) : *
  ```
- …and 9 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:reception#2` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** F7: 'the stag's die() drops THREE things the base does' plus 'a stag pays loot and XP even in playback and even when flagged not to'

**Adjudicated:** The facts hold: base die() also has the SEPPUKU_START branch, the face-flip coin, the death-clip dice and the flying weapon/hat; the launch and downed branches and the dontGiveLoot half of the guard are unreachable on a stag (every entry is behind a canGot* flag the stag sets false; dontGiveLoot is only ever set on MCSPlayer/EnemyClone/EnemyPlayer/CutsceneActor and cleared in reset); and DIVERGENCES.md:4666's 'a bear killed mid-launch' cannot happen (the test only reaches it by writing actionState). Two things do not hold: the correction says 'SIX things' but then lists four unreachable + three observable = seven, and '1-2 rng draws' is the PORT's count - the source's normal path can make up to three Math.random calls (the extra ones pick blood emitters, which the port header says it deliberately skips). The only committed false text is DIVERGENCES.md:4666.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: Base die() opens with the death sound, the playback/dontGiveLoot guard, the GOTLAUNCHED return, the downed branch and the SEPPUKU_START branch
  ```
  $ awk 'NR>=898&&NR<=926&&/playDie|dontGiveLoot|GOTLAUNCHED_STATE|isDowned\(\)|SEPPUKU_START/{printf "%d\t%s\n", NR, $0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  903	         SoundManager.instance.playDie();
  904	         if(!GameEngine.isPlayback() && !this.dontGiveLoot)
  909	         if(actionState == GOTLAUNCHED_STATE)
  914	         if(this.isDowned())
  ```
- holds: Base die()'s normal path rolls the face-flip coin (:966) and the death-clip dice (:1005 fatal / :1096 gentle); :983/:1020/:1032/:1054 are blood-emitter rolls, so the SOURCE can make up to 3 calls, not '1-2'
  ```
  $ awk 'NR>=898&&NR<=1117&&/Math.random/{printf "%d\t%s\n", NR, $0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  941	               dice = Math.random() * 3;
  966	         if(Math.random() * 2 < 1)
  983	               dice = Math.random() * 3;
  1005	               dice = Math.random() * 7;
  ```
- …and 15 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:reception#3` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F12(c): the target seeded at NPC.as:91 is 'UNRECORDED', sitting 'under a docblock that cites NPC.as:80 without noting the difference'

**Adjudicated:** True: the port records the injection on the field itself (Npc.ts:92 `NPC.as:32` - `StatsManager.getPlayer()` in the constructor; injected here), so 'UNRECORDED' is wrong; it is absent only from DIVERGENCES.md. The narrowing also holds: reset() zeroes aiCounter on both sides so both re-target on frame 1's AI tick, leaving only frame 1's doAction() different, and createFriend -> setIsFriendly overwrites target in both source and port. One precision note: getNearestEnemy takes the player only when STRICTLY nearer, so a friend at an equal distance also triggers the difference ('at least as near', not 'nearer'); and a caller that injects any target other than the live player (as the tests do) diverges the same way, not only one that passes null. The false word lives only in the run journal; nothing committed needs changing.

**Action:** no committed file carries the statement — nothing to change.

- holds: The port's target field docblock records the source seeding and the injection
  ```
  $ sed -n '92,93p' src/core/npc/Npc.ts
    /** `NPC.as:32` — `StatsManager.getPlayer()` in the constructor; injected here. */
    target: NpcTarget | null;
  ```
- holds: NPC.as:32 is the target field; the NPC.as:80 constructor seeds it with the player at :91
  ```
  $ awk 'NR==32||NR==80||NR==91{printf "%d\t%s\n", NR, $0}' reference/decompiled/shs3_android_payload/scripts/NPC.as
  32	      internal var target:NPC;
  80	      public function NPC(mcs:MCSCharacter = null)
  91	         this.target = StatsManager.getPlayer();
  ```
- …and 9 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:reception#4` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** F13: 'nine cites … name the wrong source line' (item 9 names only EnemyStag.as:302 on ogNpcAnimal.ts:98)

**Adjudicated:** Every drifted cite it names is real. The two extra ogNpcAnimal.ts dest cites (EnemyDeer.as:224, EnemyHorse.as:242) were wrong at the run and are ALREADY FIXED at HEAD. The DIVERGENCES.md cites are still wrong now: :4631 stag :112-115 (really :114-117; :78-83 is loose, the block closes at :85), :4655 EnemyHorse.as:41/EnemyStag.as:38 (really :43/:39), :4671-4672 :21/:21/:9 (really :23/:23/:10). What does not hold: (a) its list is incomplete - the same slice-3a text also drifts at :4631's bear half (:53-58/:83-86, really :55-62/:84-87), :4638/:4725 horse fence :154 (really :153) and :4638's :169-172 (the else is :166-169), :4641 stag :214 (really :213), :4643 stag :39-44 (really :41-45), :4727-4728 EnemyBear.as:41-44/EnemyStag.as:39-42 (really :42-45/:41-44); and (b) the DIVERGENCES cites escape the gate because claimcheck never reads docs/ (cite roots are src/config and src/core/npc, at the run and at HEAD), not because they are within +-1-2. The same wrong cites are copied into EnemyStag.ts, ogEnemyStag.ts, EnemyHorse.ts, ogEnemyHorse.ts and four npcSlice3a test titles; every site is below. No chaos plant anchors on any of these strings.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: At the run, ogNpcAnimal.ts:97-98 cited EnemyDeer.as:224 and EnemyHorse.as:242 for offStage.dest
  ```
  $ git show 5505a83:src/config/ogNpcAnimal.ts | sed -n '97,98p'
     *   - `dest` `EnemyBear.as:243`/`:248` · `EnemyDeer.as:224`/`:238`
     *     · `EnemyHorse.as:242`/`:250` · `EnemyStag.as:302`/`:307` — fleeing aims 100 px
  ```
- holds: The real 100-offset lines are EnemyDeer.as:223/:238 and EnemyHorse.as:241/:250; EnemyHorse.as:242 is startAction(POSE_STATE)
  ```
  $ grep -n "100;\|startAction(POSE_STATE)" reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:223:                  this.destX = StageManager.getGameStageWidth() + 100;
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:238:                  this.destX = -100;
  reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as:241:               this.destX = StageManager.getGameStageWidth() + 100;
  reference/decompiled/shs3_android_payload/scripts/EnemyHorse.as:242:               this.startAction(POSE_STATE);
  ```
- …and 12 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:reception#5` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** F4: 'derived … BEFORE reading docs/DIVERGENCES.md:4675 — the two agree'

**Adjudicated:** Holds: DIVERGENCES.md:4676's range `:688-710` is wrong for the room dispatch (it spans :684-735; :688 is the wolf-alpha arm and :710 builds a RoomGoblin), the dispatch has far more arms than the four animals, and an ai-21 row falls to the `else` and builds an EnemyCivilian (:734), which ogAi.ts:147 already encodes; F4's conclusion (the dropped doChase can never be reached - NPCManager.as:582 is the only `new EnemyStag`) stands. Overstated: the doc sentence names the four ANIMAL arms without saying 'only', so 'lists the arms as only 12/17/18/19' is a reading, not a quote; and '13 arms' is 12 `if` arms covering 13 ai values (11||16 share one), plus the else. One committed site (three wrapped lines); no copy elsewhere.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: The committed sentence: 'the ROOM dispatch (`:688-710`) has arms for ai 12, 17, 18 and 19 ... no arm for ai 21'
  ```
  $ sed -n '4675,4680p' docs/DIVERGENCES.md
  **It never bit because no dispatch ever passes it one.** `NPCManager.as`'s main switch
  builds `new EnemyStag()` at `:582` with no arguments, and the ROOM dispatch (`:688-710`)
  has arms for ai 12, 17, 18 and 19 — horse, bear, boar, deer — and **no arm for ai 21 at
  all**. `config/ogAi.ts` already encodes exactly that (`:107` main, nothing in the room
  ```
- holds: createRoomNPC is at NPCManager.as:671
  ```
  $ awk 'NR==671{printf "%d\t%s\n", NR, $0}' reference/decompiled/shs3_android_payload/scripts/NPCManager.as
  671	      public static function createRoomNPC(npcID:int, x:int, y:int, doChase:Boolean = false) : NPC
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#1` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F13 detail: the explanation of why the gate misses the drifted cites ("out of scope entirely")

**Adjudicated:** True: the gate resolves and range-checks every F13 item 1-8 cite (the bare ones via the module header), never reads the line content, and passes today with them in the tree; the prose-retargeted sibling cites (bear `:21`, horse `:21`, horse `:154`) are resolved against EnemyStag.as, which Rule 4 says must be fixed by naming the file (EnemyBear.as:23, EnemyHorse.as:23, EnemyHorse.as:153 verified). Still unfixed at HEAD in EnemyStag.ts, ogEnemyStag.ts, DIVERGENCES.md and two test titles; F13's 'out of scope entirely' mechanism exists only in the run journal. Seen but out of this item's scope: the horse `else` those same DIVERGENCES/test lines cite as `:169-172` is really `:166-169`.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: The gate's first half is EXISTENCE + RANGE over src/config and src/core/npc (it never reads the cited line's content); the numeric half reads src/config only
  ```
  $ grep -n 'EXISTENCE + RANGE\|const CITE_ROOTS\|const NUMERIC_ROOT\|cite.end > lines.length' scripts/gates/claimcheck.ts
  7: *   EXISTENCE + RANGE over `src/config/**` and `src/core/npc/**` — does the cited file
  45:const CITE_ROOTS = ['src/config', 'src/core/npc'];
  46:const NUMERIC_ROOT = 'src/config';
  194:    if (cite.start < 1 || cite.end > lines.length || cite.end < cite.start) {
  ```
- holds: Every cite in F13 items 1-8 is resolved by the gate, and the prose-retargeted sibling cites (bear :21, horse :21, horse :154) resolve against EnemyStag.as via the header
  ```
  $ node --no-warnings --input-type=module -e 'import {prepare,moduleCites} from "./scripts/gates/claimcheckLib.ts"; import {readFileSync} from "node:fs"; for (const f of ["src/core/npc/EnemyStag.ts","src/config/ogEnemyStag.ts"]) for (const c of moduleCites(prepare(readFileSync(f,"utf8")))) if ([10,11,13,14,25,26,47,49,51].includes(c.line)) console.log(f, "L"+c.line, c.raw, "->", c.file+":"+c.start+"-"+c.end, "via", c.via)'
  src/core/npc/EnemyStag.ts L10 :21 -> EnemyStag.as:21-21 via header
  src/core/npc/EnemyStag.ts L10 :21 -> EnemyStag.as:21-21 via header
  src/core/npc/EnemyStag.ts L11 :9 -> EnemyStag.as:9-9 via header
  src/core/npc/EnemyStag.ts L13 :39-42 -> EnemyStag.as:39-42 via header
  ```
- …and 8 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#2` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** F13 completeness: "nine cites" and the offStage.dest count

**Adjudicated:** Holds: EnemyStag.ts:11 `(:9)` is wrong (:10) and absent from F13; the gate reads ogEnemyStag.ts:24 `:215-220` and ogEnemyHorse.ts:12/16-17's stag cites as EnemyHorse.as; EnemyStag.as:38 is `reset();` (IDLE is :39); DIVERGENCES and the :784 title carry the drift; offStage.dest's governing set is 12 cites. Does not hold: the count, since item 9 is ALREADY-FIXED at HEAD and HEAD also ruled `:307` a wrong-branch cite, so the nine items held 13 wrong cites, not 12; and the site list is incomplete. It misses DIVERGENCES.md:4728 `EnemyStag.as:39-42` and EnemyHorse.ts:11 (the same `:41-46`/`:39-44` pair). It also misses the wrong cites that share those lines: `EnemyHorse.as:41` at 4655 (IDLE is :43), the bear's `:41-46` (really :42-46), and the horse's `:33-35` (the empty if is :34-36). Sites below include F13 items 1-3 and 6-8, which are still wrong at HEAD; the sibling `:21`/`:154` sites are listed under #1.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: EnemyStag.as field declarations: destX :6, idleCounter :8, doChase :10 (port cites :5/:7/:9 and header :9)
  ```
  $ grep -n 'internal var' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  6:      internal var destX:int;
  8:      internal var idleCounter:int;
  10:      internal var doChase:Boolean;
  ```
- holds: EnemyStag.ts still cites :9 at L11 (header) and EnemyStag.as:5/:7/:9 at L47/49/51
  ```
  $ grep -n '`:9`\|`EnemyStag.as:[579]' src/core/npc/EnemyStag.ts
  11: * is simply absent, and `doChase` is declared with no initialiser (`:9`). So a
  47:  /** `EnemyStag.as:5` */
  49:  /** `EnemyStag.as:7` */
  51:  /** `EnemyStag.as:9` — no initialiser in the source, and the constructor never writes it. */
  ```
- …and 9 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#3` — **CONFIRMED** · COMMITTED-TEXT

**Refuted:** F4 detail: "the dispatch row is `args: []`, so nothing needs it to type-check"

**Adjudicated:** True: F4's 'nothing needs it to type-check' is false. Three stag construction sites in tests/npcSlice3a.test.ts pass a sixth argument (:163 via the helper, :205, :775), `npm run typecheck` includes tests/, and the chaos plant 'fix the constructor so it assigns doChase' is anchored on `void _doChase;` (one occurrence). No src code constructs EnemyStag (ogAi.ts:107 is a data row). The only committed error is the docblock's stated reason at EnemyStag.ts:56-57 ('so the dispatch still type-checks'), the sole copy of that wording.

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- holds: Three test construction sites pass a sixth (doChase) argument, and :775-776 hands `true` and pins the discard
  ```
  $ awk 'NR>=157&&NR<=164 || NR==205 || NR>=775&&NR<=776 {print NR": "$0}' tests/npcSlice3a.test.ts
  157:   const npc = new EnemyStag(
  158:     world({ nearestEnemy: () => t, ...o.world }),
  159:     anims,
  160:     geometry,
  ```
- holds: npm run typecheck includes tests/ via tsconfig.node.json
  ```
  $ grep -n '"typecheck"' package.json; grep -n '"include"' tsconfig.node.json
  13:    "typecheck": "tsc -p tsconfig.json && tsc -p tsconfig.node.json",
  25:  "include": ["tests", "scripts", "vite.config.ts"],
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#4` — **PARTIAL** · COMMITTED-TEXT

**Refuted:** F5: "correctly labelled in both docblocks (…src/config/ogEnemyStag.ts:16-18)", and blaming the stag's override for the XP drop

**Adjudicated:** Core holds. All four animal inits set x5+45 and only the stag overrides setLevel. NPC.as:252 writes x2+20, createNPC runs init (:637) before createEnemy's setLevel, and the port and the stag-vs-deer shape test (xp included) mirror that. So the XP drop is inherited base behaviour for every animal, not a stag bug; ogNpcAnimal.ts:25-26 and DIVERGENCES.md:4686-4688 present it as the stag's. Two evidence details are wrong. ogEnemyStag.ts:15-19 does have XP wording: it names `OG_NPC_XP`, just nothing about the reward drop. And the setLevel guard is NPCManager.as:877-880, not 878-880. A reworded ogNpcAnimal.ts docblock must keep the `EnemyStag.as:62` cite (a claimcheck CONTEXT entry keys on it) and its two-line length (configTwins.test.ts cites ogNpcAnimal.ts:81-82).

**Action:** **corrected** in `f4e4ec2` (config cites the F1 commits `d733f88` / `1637466` had already fixed are not repeated).

- does NOT hold: Refutation: ogEnemyStag.ts:15-19 has 'no XP wording' - it names `OG_NPC_XP` (the base XP curve constant), though it has zero reward/levelled/worth/pays wording, so F5's cite of it as labelling the drop is still wrong
  ```
  $ sed -n '15,19p' src/config/ogEnemyStag.ts; grep -ciE 'reward|levelled|worth|pays' src/config/ogEnemyStag.ts
   *   - **`setLevel` (`:48-70`) is a hand copy of `NPC.as:239-260`** and differs
   *     from it in nothing but decompiler artifacts (a split `var factor:Number =
   *     NaN;` declaration and `this.` prefixes). It needs no number of its own —
   *     it reuses `OG_NPC_SET_LEVEL` and `OG_NPC_XP`. DIVERGENCES records it as a
  ```
- holds: The XP-drop label lives in ogNpcAnimal.ts:25-26 and attributes it to the stag alone
  ```
  $ sed -n '21,28p' src/config/ogNpcAnimal.ts
     * `EnemyBear.as:38` · `EnemyDeer.as:35` · `EnemyHorse.as:41` · `EnemyStag.as:37`
     * — `xp = level * 5 + 45`, NOT the base's `* 2 + 20` (`NPC.as:218`). Twins:
     * `EnemyWolf.as:32`, `EnemyFox.as:26`, `EnemyCivilian.as:35`.
     *
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#5` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F12(c): "UNRECORDED" and "bites THIS class … a DIFFERENT frame-1 path"

**Adjudicated:** True: NpcController's constructor calls `npc.changeTarget(this.proxy)` before any next(), and DIVERGENCES.md:4579-4580 records that it hands every actor the player proxy, so F12(c)'s 'UNRECORDED' and 'bites THIS class' are overstated. What remains is only the raw-constructor null default (Npc.ts:130) under a bare `NPC.as:80` docblock, which no DIVERGENCES line names. F12 also undercounted the test sites: :157 passes the Dummy `t`, while :205 and :775 pass null and never call update(). NpcController is only built in tests today. The corrected statements live only in the run journal; no committed text is false.

**Action:** no committed file carries the statement — nothing to change.

- holds: NpcController's constructor hands the actor the player proxy before any next()
  ```
  $ sed -n '86,95p' src/core/npc/NpcController.ts
  export class NpcController implements OpponentController {
    private readonly proxy = new PlayerProxy();
    private clock = ZERO;
    private heldMoveX = ZERO;
  ```
- holds: The port's base constructor defaults target to null under a bare `NPC.as:80` docblock; changeTarget assigns target
  ```
  $ awk 'NR>=124&&NR<=134 || NR>=781&&NR<=784 {print NR": "$0}' src/core/npc/Npc.ts
  124:   /** `NPC.as:80` */
  125:   constructor(
  126:     world: NpcWorld,
  127:     anims: AnimLibrary,
  ```
- …and 7 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#6` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F8: LAND_STATE as a reachable dead end, plus the quoted switch text

**Adjudicated:** True on all three points. EnemyStag.as:288 is `break;`, so F8's quote is false. All 20 literal startAction(FALL_STATE) calls in the payload are self-calls, and nothing assigns actionState = FALL_STATE. The only variable-state startAction calls on another object target network EnemyPlayers. The base's FALL entry sits in NPC.init (:226), which EnemyStag.init never calls through super, so a stag cannot reach FALL or LAND. A GRAZING/PAWING/REARING clip ending does re-enter IDLE/RUN whatever the state. No committed file claims a LAND dead end, so nothing in the repo needs to change.

**Action:** no committed file carries the statement — nothing to change.

- holds: EnemyStag.as:288 is `break;` (F8's 'break is absent, the next line is :289' is false)
  ```
  $ awk 'NR>=284&&NR<=290 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  284:                   this.startAction(LAND_STATE);
  285:                }
  286:                break;
  287:             case LAND_STATE:
  ```
- holds: Every literal startAction(FALL_STATE) in the payload is a self-call (count of non-self calls = 0), and nothing assigns actionState = FALL_STATE
  ```
  $ grep -rn 'startAction(\(MCSActor\.\)\?FALL_STATE)' reference/decompiled/shs3_android_payload/scripts | wc -l; grep -rn 'startAction(\(MCSActor\.\)\?FALL_STATE)' reference/decompiled/shs3_android_payload/scripts | grep -vcE ':[0-9]+: *(this\.)?startAction\('; grep -rnE 'actionState = (MCSActor\.)?FALL_STATE' reference/decompiled/shs3_android_payload/scripts | wc -l
        20
  0
         0
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#7` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F3 mapping and counts line (f): "all 44 mapped in F3"

**Adjudicated:** True: the port's second d3 compares `dice === OG_STAG.idle.runOn` (.as :220) and only the clip roll uses ONE (.as :132), so F3's ':132/:220 -> ZERO/ONE' is wrong and contradicts F2, which maps :220 to runOn. Of the 44 literal-bearing lines, F3 omits exactly :127, :136 and :215. The core leak count is 0. No committed file carries the wrong mapping (ogEnemyHorse.ts pins runOn to the horse's :160).

**Action:** no committed file carries the statement — nothing to change.

- holds: The port's second d3 uses OG_STAG.idle.runOn (.as :220), while the clip roll uses ONE (.as :132)
  ```
  $ grep -n 'dice ===' src/core/npc/EnemyStag.ts
  153:        if (dice === ZERO) this.startAnim(OG_ANIM.HORSE_IDLE);
  154:        else if (dice === ONE) this.startAnim(OG_ANIM.HORSE_GRAZING);
  155:        else if (dice === OG_STAG.idle.pawOn) this.startAnim(OG_ANIM.HORSE_PAWING);
  210:            if (dice === ZERO) {
  ```
- holds: .as :132 and :220 are both `else if(dice == 1)`; :127/:136/:215 are the dice rolls and pawOn
  ```
  $ awk 'NR==127||NR==132||NR==136||NR==215||NR==220 {print NR": "$0}' reference/decompiled/shs3_android_payload/scripts/EnemyStag.as
  127:                dice = Math.random() * 3;
  132:                else if(dice == 1)
  136:                else if(dice == 2)
  215:                      dice = Math.random() * 3;
  ```
- …and 4 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#8` — **PARTIAL** · MEASUREMENT-ONLY

**Refuted:** F1 detail: "nothing else in the payload names it" (checkPlayer)

**Adjudicated:** Core holds. F1's evidence grep was over 'EnemyStag', which says nothing about checkPlayer. Its literal claim is false because other classes declare checkPlayer. The conclusion survives: every call is `this.checkPlayer();`, and neither NPC.as nor MCSActor.as names it, so `private` loses nothing. The refutation's own count is wrong, though. FIVE sibling classes declare it (EnemyBear :236, EnemyBoar :246, EnemyDeer :214, EnemyFox :216, EnemyHorse :230), not three. The sentence exists only in the run journal.

**Action:** no committed file carries the statement — nothing to change.

- does NOT hold: Refutation: `grep -rn checkPlayer` returns three sibling declarations (EnemyBear.as:236, EnemyDeer.as:214, EnemyFox.as:216) - there are five siblings; it misses EnemyBoar.as:246 and EnemyHorse.as:230
  ```
  $ grep -rn 'function checkPlayer()' reference/decompiled/shs3_android_payload/scripts | sort
  reference/decompiled/shs3_android_payload/scripts/EnemyBear.as:236:      internal function checkPlayer() : *
  reference/decompiled/shs3_android_payload/scripts/EnemyBoar.as:246:      internal function checkPlayer() : *
  reference/decompiled/shs3_android_payload/scripts/EnemyDeer.as:214:      internal function checkPlayer() : *
  reference/decompiled/shs3_android_payload/scripts/EnemyFox.as:216:      internal function checkPlayer() : *
  ```
- holds: Every call is a self-call `this.checkPlayer();` (count of other forms = 0)
  ```
  $ grep -rn 'checkPlayer()' reference/decompiled/shs3_android_payload/scripts | grep -v 'function checkPlayer' | grep -vc 'this.checkPlayer();'
  0
  ```
- …and 3 more check(s), each re-executed and matched; full commands and outputs are in the journal.

### `EnemyStag:override-cite#9` — **CONFIRMED** · MEASUREMENT-ONLY

**Refuted:** F2: twin rule "applied correctly"

**Adjudicated:** True: ogEnemyStag.ts declares `chaseDist: 400` a twin of OG_BEAR.chaseDist as a copied literal. It is pinned by equality at configTwins.test.ts:108, not imported, and both 400s are the same `doChase && dist < 400` rule on their cited lines. F2 judged only `idle` against the twin rule. The rule (3f41c9d, 09-13) postdates slice 3a (aa4f345, 09-12), and with both sides shipped, row 2 (TEST-PIN) is the applicable action. The committed text and numbers are right, so nothing in the repo needs to change.

**Action:** no committed file carries the statement — nothing to change.

- holds: ogEnemyStag.ts declares chaseDist 400 as a twin of OG_BEAR.chaseDist, a copied literal
  ```
  $ sed -n '34,38p' src/config/ogEnemyStag.ts
    /**
     * `:305`/`:319` — a chasing stag rears at a player within 400 px (then charges);
     * a non-chasing one bolts at `OG_ANIMAL.fleeDist` instead. Twin of `OG_BEAR.chaseDist`.
     */
  ```
- holds: OG_BEAR.chaseDist is 400 (line 46 at the run commit, 47 at HEAD)
  ```
  $ git show 5505a83:src/config/ogEnemyBear.ts | grep -n 'chaseDist: '; grep -n 'chaseDist: ' src/config/ogEnemyBear.ts
  46:  chaseDist: 400,
  47:  chaseDist: 400,
  ```
- …and 5 more check(s), each re-executed and matched; full commands and outputs are in the journal.

