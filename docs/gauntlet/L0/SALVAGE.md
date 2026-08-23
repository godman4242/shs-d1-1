# L0 — SALVAGE / RESUME CARD

> **Read this first if the L0 run died.** Written 2026-08-13 mid-flight, on notice
> that usage was about to run out. Everything below is on disk and committed.
> **No completed research needs to be redone.**

## ▶ SESSION 27 (2026-08-23) — THE FINISH RUN, WIDENED. Live progress at the top.

**No wall yet. Every wave CLEAN, zero agents dead, zero VOID verdicts.**

| Wave | Work | Agents | State |
|---|---|---:|---|
| **A** | `l0-finish-wf3` `{tier:'t2', batches:1, tag:'s27a'}` — 45 corroborating | 1 | ✅ **CLEAN** — `wf_5278be09-5a8` → `run12` · judged 1,555 → **1,600** |
| **A′** | `wfcheck.mjs` + `workflowScripts.test.ts` — the workflow scripts had ZERO coverage | 0 | ✅ **LANDED** — suite 62 files/983 → **63/1001** |
| **B** | `{tier:'t1', batches:3, tag:'s27b'}` — 21 overturn-claimers, **3 lenses** | 9 | ✅ **CLEAN** — `wf_a61d14b7-fe6` → `run13` · judged → **1,621** |
| **B′** | `BATCH_SIZE` 24 → **7** as a DEFAULT, not a flag | 0 | ✅ **LANDED** |
| **C** | `{tier:'t2', batches:3, tag:'s27c'}` — 30 corroborating | 3 | ✅ **CLEAN** — `wf_b0ff4d6a-fe6` → `run14` · judged → **1,651** |
| **D** | `{tier:'t1', batches:3, tag:'s27d'}` — 21 overturn-claimers | 9 | ⏳ **IN FLIGHT** — `wf_f1c7e8a2-a03` → `run15` |
| **E** | t2 mop-up of whatever D emits | ~1–3 | ⏳ |
| **F** | `l0-finish-wf4` — dry-loop + completeness, **6 hunt targets** | 13–25 | ⏳ |
| **G** | `l0-rewrite` — 14 slices × (writer + **2** blind verifiers) | **42** | ⏳ |
| **H** | gates green · `GAUNTLET.md` corrections · §3.7 re-arm | 0 | ⏳ |

### ⚑ THE FAN-OUT WAS TOO NARROW AND THE RULE NEVER SAID IT HAD TO BE

Owner, this session: *"my own rule was one workflow at a time, not one agent."* Correct —
§3.8 says *"a stage may fan out to as many agents as the lane needs."* Wave A ran ONE agent
over 45 findings because the batch count was read out of the MANIFEST instead of judged.
§2 routes L0 to Opus at **UNLIMITED** agents and §3.3 gives a heavy lane **3–5 lenses**;
`buildWorklist`'s t2 setting (48-wide packets, one lens) is the *bounded-lane* config.

Widened, each **confirmed by executing the script**, not by arithmetic:

| | was | now |
|---|---:|---:|
| t1 judging | 2 | **9** — 3 packets × cite+hunter+**contradiction** |
| `l0-finish-wf4` | 9–17 | **13–25** — the 7,381-frame corpus split 3 ways |
| `l0-rewrite` | 28 | **42** — a *second* lensed verifier per slice |

### ⚑ THE EMISSION RATIO — the number that says whether judging converges

| wave | judged | new | ratio |
|---|---:|---:|---:|
| A | 45 (t2, 1 lens) | 6 | 0.13 |
| B | 21 (t1, **3** lenses) | 45 | **2.14** ← the widening's one-time cost |
| C | 30 (t2, 1 lens) | 11 | 0.37 |

The tail went 27 → **51** → 32. The contradiction lens's backlog was a one-off, as
predicted, and it is now MEASURED. If a ratio ever sits above 1 for two consecutive waves,
that is a real result and it goes to the owner for a ruling — the gate is not softened
(§3.6).

### ⛔ OWNER RULING 2026-08-23 — JUDGING STOPS AFTER WAVE E

**Asked and answered, because §3.6 says a gate is never softened to fit a result.** The
t1 tier does not converge, and splitting emissions BY TIER is what made it legible:

| wave | judged | new t1 | new t2 | tier ratio |
|---|---:|---:|---:|---:|
| A | 45 t2 | 0 | 6 | t2→t2 **0.13** |
| B | 21 t1 | 21 | 24 | t1→t1 **1.00** |
| C | 30 t2 | 0 | 11 | t2→t2 **0.37** |
| D | 21 t1 | 24 | 24 | t1→t1 **1.14** |

t2 decays fast and emits **no overturn-claimers at all**. t1 is a **fixed point** at
~1.0–1.14: every overturn-claimer judged spawns roughly one more. It will never go dry, so
"loop until dry" is not available on this tier at any budget.

**RULING: bank wave E, then STOP judging.** Whatever remains unjudged stays **KILLED** —
which is the EXISTING fail-closed rule (§0: a lead may not enter the ledger), not a new
concession. No gate item moved, no threshold was relaxed. ~60 late-generation leads of
~1,780 are excluded; they are refinements of refinements, and every one of them is still
on disk under `run*/claims.json` if a later lane wants them.

Rejected alternatives, recorded so nobody re-litigates them:
- *Keep judging until t1 empties* — it is a fixed point; it does not empty.
- *Drop the contradiction lens to force convergence* — that trades away the ONLY check on
  whether two surviving findings disagree, immediately before 1,309 of them are written
  into the ledger by writers who would otherwise pick between them arbitrarily.

### ⚑ A CRITIC CAUGHT A FALSE NEGATIVE IN citeLint — SAFE DIRECTION, NOT FIXED YET

`combat-core/crit-1.3-is-sealed-…` was flagged QUOTE_UNVERIFIED in `citelint-run13.json`.
Byte-checked by the lead against `§1t99s0§.as`: `:3272 if(this.§1t4414s0§ ==
this.§1t4415s0§)` and `:3274 return _loc2_ * 1.3 + this.§1t1243s0§;` are both present and
exact. **The flag is wrong.**

It fails SAFE — a good cite marked suspect, never a bad cite passed — and gate L0-A goes
RED on `BROKEN`, not on `QUOTE_UNVERIFIED`, so no gate reads it. **Deliberately NOT fixed
during L0:** changing a gate input while that gate is being driven is what §3.6 warns
against. Counts are small (5 in run13, 2 in run14, 0 in run15). Queued for after L0.

### ⚑ THE WORKFLOW SCRIPTS HAD NEVER BEEN CHECKED BY ANYTHING

~1,100 lines that spawn 40+ agents each, and no test, lint or typecheck ever read them:
they are `.js`, they live outside `src/`, and **`node --check` rejects every one of them**
(top-level `return` is legal only inside a function body, which is how the runtime
evaluates them). A broken script was only ever discovered by launching it.

`scripts/gauntlet/wfcheck.mjs` compiles each the way the runtime does, then **executes** it
against stubs on BOTH branches — every agent dead, and every agent alive. `pipeline()`
really runs its stages; the first version stubbed them away and reported a confident pass
on a verify stage it never executed.

```bash
node scripts/gauntlet/wfcheck.mjs scripts/gauntlet/l0-rewrite.workflow.js run
#   SYNTAX OK · RUN OK [all agents DEAD] 14 · RUN OK [all agents ALIVE] 42
```

`tests/workflowScripts.test.ts`, 18 tests, every guard chaos-planted and watched RED:
a syntax error · **a `const` spread into an array declared ABOVE it** (parses clean, throws
at evaluation — this bug was written into `wf4` this session) · a script broken only on the
ALIVE branch · a pipeline stage that throws · `buildWorklist` advertising different lenses
than the workflow spawns · `BATCH_SIZE` drifting back above 8.

### ⚑ THE LEDGER MISREAD A FRAME: "STANCE IS HARD-LOCKED IN COMBAT" FALLS

Verified line-by-line by the lead, not taken from the critic:

```
§1t99s0§.as:3050  return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
§1t99s0§.as:3060  if(this.§1t4414s0§ < 48) { return; }   <- early-out, then a 4-branch cycler
§1t99s0§.as:3162  this.§1t4414s0§ -= 48;                 <- and it DEBITS the meter
```

A hard lock needs no cycler, no threshold and no debit. `RESUME_HERE.md`'s Stage-2 landmine
has the in-combat switch as **INFERRED**; it is **CONTRACT**, at threshold 48. RR:178 and
`SHSD_MASTER_REFERENCE.md`:388/:2099 fall with it. **Ledger correction only — `Sim.ts` and
the duel-baseline move in L5 and nowhere else (§4).**

And the grey caption is **WEB-ONLY**, which is why its string id looked broken:

```
web     §1t113s0§.as:110   "<font color='#000000'>" + getString(175) + "</font>"   Critical Hit
web     §1t113s0§.as:111   "<font color='#BBBBBB'>" + getString(960) + "</font>"   the grey caption
android BattleUI.as:102    crittext.text = LangManager.getString(175)   <- ONE fixed string
android updateReload()     three lines, no ratio==0 branch, no second label
```

`getString(960)` is absent from `118_Mobile_Lang_EN.bin` because v0.682 never had it. The
absence IS the finding.

---

## ▶ SESSION 26 (2026-08-22) — THE FINISH RUN. Live progress at the top.

| Wave | Work | Agents | State |
|---|---|---:|---|
| **0** | wall-#9 insurance — structured JSON side-writes + `--critic-json` salvage | 0 | ✅ **LANDED** — 60 files / 953 tests |
| **1** | `l0-finish-wf3` `{tier:'t1', batches:3, tag:'s26a'}` — 67 overturn-claimers | 6 | ✅ **CLEAN** — `wf_54792c81-6cd` → `run8` |
| **2** | `l0-finish-wf3` `{tier:'t2', batches:13, tag:'s26b'}` — 586 corroborating | 13 | ⚠ **WALL #9** — 4 returned, 9 died; **6 batches banked** → `run9` |
| **2b** | t1 `{batches:2, tag:'s26c'}` — the 31 remaining overturn-claimers | 4 | ✅ **CLEAN** — `wf_26e01058-359` → `run10` |
| **2c** | t2 `{batches:8, tag:'s26d'}` — 355 corroborating | 8 | ✅ **CLEAN** — `wf_0504102f-f7a` → `run11` |
| **2d** | t2 `{batches:1, tag:'s26e'}` — the 45 second-generation corroborating | 1 | ⛔ **WALL #10** — 1 agent died at 1 tool use, **nothing on disk, nothing lost** |
| **2e** | ↻ re-run 2d, then the final t1 mop-up | 1 + 2 | ⏳ **NEXT SESSION** |

**WALL #10 (2026-08-23, `resets 6:40pm`).** The single agent died 4.4 s in, having made
one tool call. No side-file, no journal result, nothing to salvage — and nothing lost,
because it had produced nothing. The workflow reported it exactly right:

```
INTEGRITY: INCOMPLETE — 0/1 critics returned · batches with NO live critic:
  [t2-corroborating-01] · 1 agents DIED. Zero live critics means UNJUDGED,
  never confirmed (§0).
```

That is the fail-closed accounting behaving as designed on the smallest possible case:
a batch nobody judged is UNJUDGED, and `buildWorklist` still lists it. Handoff re-armed
for a fresh session — the remaining work is a 28-agent synthesis and it degrades behind
ten walls of history.

> ⛔ **ONE WORKFLOW IN FLIGHT** (owner rule 2026-08-22, `GAUNTLET.md` §3 item 8). Waves 1
> and 2 ran together and took wall #9 as a pair. Every wave from 2b on runs alone.
| **3** | mop-up t1 over the overturn-claimers waves 1–2 generate | ~2–8 | ⏳ |
| **4** | `l0-finish-wf4` `{tag:'s26d'}` — dry-loop + completeness | ≤17 | ⏳ |
| **5** | ledger rewrite — 12 system writers ⇉ 12 blind verifiers, + §6 | 27 | ⏳ |
| **6** | gates green · `GAUNTLET.md` corrections · §3.7 re-arm | 0 | ⏳ |

### ⚑ C1 IS CORRECTED AGAIN — THE BLOB XOR KEY IS PER-FILE, NOT 109

A wave-2c critic did not take C1 on trust. It read `ResourceManager.as:186`
(`decryptByteArray(ba, resourceFileNameArray[num].charCodeAt(1))` — the key is **the
second character of the file's own name**), then RAN the decrypt+inflate on all five
blobs and reported the byte counts:

| blob | key | inflated |
|---|---|---:|
| `115_Mobile_SHS3Resource` | `'h'` = 104 | 1,040,849 |
| `113_Mobile_MusicResource` | `'u'` = 117 | 1,402,677 |
| `122_Mobile_SoundResource` | `'o'` = 111 | 29,623 |
| `124_Mobile_ImageResource` | `'m'` = 109 | 1,908,229 |
| `120_Mobile_BGResource` | `'g'` = 103 | 4,412,340 |

**C1 said "key `'m'`=109" as though it were universal. 109 is the IMAGE key only.** C3's
audio recovery at key 111 was right and is now explained rather than coincidental. Every
later brief must carry the per-file rule, or four of the five blobs read as noise.

Same critic parsed `115` and found **1,912 exported equipment symbols** (torso/lowarm/
uparm/pelvic 151 each, stomach 150, item 112, weapon 109, hat 96 …) — the sprite-
compositing manifest §4's ⑤ calls a from-scratch-art blocker.

---

### ⚑ WALL #9 — AND THE INSURANCE PAID, IN NUMBERS

The session usage limit killed **9 of wave 2's 13 agents** (`You've hit your session
limit · resets 1:40pm`). The workflow returned, correctly and fail-closed:

```
critics_run 4/13 · 192 verdicts · 9 agents DIED
INTEGRITY: INCOMPLETE — batches with NO live critic:
  [t2-corroborating-01, 06, 07, 08, 09, 10, 11, 12, 13]
Zero live critics means UNJUDGED, never confirmed (§0).
```

**But six batches were on disk, not four.** Batches 01 and 06 wrote their structured JSON
and *then* died before returning, so the workflow could not know about them:

```
salvage: journal + side-files, deduped
  critics=10  (4 from the journal + 6 from disk)
  verdicts=288  (deduped 192 verdict rows — the overlap)
```

**96 verdicts — two complete 48/48 batches — recovered that the run itself reported as
lost.** That is wave 0's whole purpose, paid out on its first real wall. Under the old
regime those two batches would have been re-judged from scratch at full agent cost.

⚠ **And the workflow's INTEGRITY string is still right to name them.** It reports what
IT observed; the salvage reports what is on DISK. Both are true, and the fail-closed one
must never be quietly overwritten by the optimistic one — the worklist is what reconciles
them, by asking only "does this claim have a live verdict".

### ⚑ THE STALE-WORKLIST DEFECT WALL #9 EXPOSED

`buildWorklist.py` had its run list **hardcoded** — `run2 … run7` — while `gateL0.py` and
`buildLedgerEvidence.py` both glob `run*`. So after run8/run9 landed:

```
gate:      1,587 claims pooled · 1,169 judged ids
worklist:  1,506 rows           ·   814 judged   ← STALE
```

It was offering **653 already-judged findings for re-judging**, and the relaunch would
have paid full agent cost to rule on them a second time. Nothing warned, because a
hardcoded list that is merely OUT OF DATE looks exactly like one that is complete.

Fixed by globbing, with the first tests `buildWorklist.py` has ever had (4, red-first,
chaos-planted). Correct remainder after the fix:

```
buildWorklist: 1587 rows -> 1548 distinct ids · already judged 1169
  WF-3a critic findings   31 across 2 batches x cite+hunter = 4 agents
  WF-3b critic findings  348 across 8 batches x cite       = 8 agents
```

**379 findings left, 12 agents — not 653 and 19.**

---

### ⚑ WAVE 1 — `INTEGRITY: CLEAN`. Judged **814 → 881**.

```
critics 6/6 returned · 134 verdicts, 134 LIVE, 0 VOID · 17 refuted
overturn rulings 134 — UPHELD 103 · REJECTED 31   (23% rejected)
every packet fully judged: 24/24 · 24/24 · 19/19, both lenses. 0 shortfalls. 0 agents died.
49 new findings · citeLint on them: 39 RESOLVES · 0 BROKEN · 10 QUOTE_UNVERIFIED
```

Pooled after run8: **1,555 claim rows · 881 judged ids · 612 UPHELD · 58 NOT-UPHELD**,
**466 surviving overturns on 243 distinct ledger sentences.**

**The wall insurance paid before it was needed.** All six agents wrote their structured
object to `critics/<batch>.<lens>.s26a.json` *before* returning — verified on disk while
the run was still live (24/24 judged, 0 skipped, 0 VOID). A wall at that moment would
have cost wall-clock and nothing else.

**Verdict quality, spot-checked rather than assumed.** These critics re-derived rather
than re-read: one streamed the whole 329 MB `payload.xml` in 4 MB chunks to prove
`skilldata`/`npcdata` appear **zero** times and the two `itemdata`/`questdata` hits are
BigDB table names in a string pool, not XML roots (C2, independently reconfirmed). One
recomputed the entire PremiumData↔`heavenlyprice` join from scratch and **corrected the
finding's own `build` field** — `reference/extracted/itemdata.xml` is the ANDROID blob
(184,002 B vs 184,044 B, the 42-byte decl+CRLF delta), so the row is v0.682, not "both".
One refuted a "byte-identical in both builds" claim by diffing the blobs and finding
enemy id 443 added to every late-game survival wave in the WEB build only.

---

### ⚑ WAVE 0 — THE HOLE WALL #8 LEFT IS CLOSED

Wall #8's damage was specific and it was NOT recoverable: seven finished critic reviews
sat on disk as `.md` while both journals held **zero result records**, so the structured
verdicts were destroyed. Prose cannot substitute — **§3.2 bars a blind re-judge from
reading another agent's reasoning**, so a lost verdict can only be re-earned by judging
the claim again from scratch. The `.md` write-back saved the *record* and lost the *work*.

**Both halves of the fix are in:**

1. `l0-finish-wf3` and `l0-finish-wf4` now make every agent write **two** files before
   returning — its prose to `<stem>.md` **and the exact object it is about to return** to
   `<stem>.json`.
2. `salvageJournal.py` takes `--critic-json <glob>` and extracts from those side-files
   **with or without a journal**. Journal and side-files may be given together — the
   partial-wall case — and rows are **deduped** so an agent that both returned and wrote
   to disk is not counted twice. That dedupe is not cosmetic: gate **L0-B** rules a claim
   refuted on a **majority** of its live verdicts, and one duplicated ruling manufactures
   a majority that never happened.

**Recovery command after a wall** (the tag is the run's, e.g. `s26a`):

```bash
python3 scripts/gauntlet/salvageJournal.py --out docs/gauntlet/L0/run8 \
    --critic-json 'docs/gauntlet/L0/critics/*.s26a.json'
```

`tests/salvageCriticJson.test.ts` — 11 tests, watched RED at 9/11 before the patch, and
**both new guards chaos-planted**: disabling the verdict dedupe reds *"does NOT count a
verdict twice"*, and silently dropping an unparseable side-file reds *"NAMES a side-file
it could not parse"*. Suite **59 files / 942 → 60 files / 953 green**; tsc ×2 = 0; eslint = 0.

---

## What is banked (counted on disk 2026-08-22, not asserted)

| Artifact | Where | State |
|---|---|---|
| Evidence index | `index/*.json` (12 files) | ✅ incl. the 329 MB `payload.xml` histogram, the **string table** and `resolved_names.json` |
| **10** source surveys, full prose | `sources/*.md` | ✅ all ten — the last four landed 2026-08-20 |
| 12 system surveys, full prose | `systems/*.md` | ✅ all twelve |
| **81** critic reviews, full prose | `critics/*.md` | ✅ 12 systems × 3–4 lenses, 10 sources × 2, plus the judging batches |
| Orphaned reviews | `critics/orphaned/` | ⚠ prose recovered at wall #8, **verdicts lost** — see its README |
| Structured claim set | `run2/` … `run7/` (6 dirs) | ✅ **1,506 claim rows · 2,896 verdict rows** |
| Machine cite audit | `citelint*.json` (6 files) | ✅ every claim, every run |
| Judging worklist | `worklist/` + `MANIFEST.json` | ✅ regenerated by script, self-healing |
| Dedup ground truth | `SEEN_CLAIM_IDS.txt` | ✅ 1,467 ids, 814 marked judged |
| Ledger evidence | `LEDGER_EVIDENCE.md` + `.json` | ✅ the rewrite's **only** admissible input |
| Binary gate | `gate.json` | ✅ six items, currently 1 GREEN / 5 RED |
| Raw workflow journals | `wf-journal*.jsonl` (9 files) | ✅ copied into the repo |
| The five workflow scripts | `scripts/gauntlet/l0-*.workflow.js` | ✅ all carry the C1/C2/C3 corrections |
| Stage-0 findings S0-1…S0-5 | `journal.md` | ⚠ **S0-5 is SUPERSEDED** — see C3 below |

### The tooling this session built — all red-first, all chaos-planted

| Script | Test | What it decides |
|---|---|---|
| `citeLint.py` | `tests/citeLint.test.ts` (23) | does a cite resolve — path, line, quote. Gate **L0-A** |
| `buildWorklist.py` | — | dedupe, join the cite audit, tier the judging, write `SEEN_CLAIM_IDS` |
| `buildLedgerEvidence.py` | `tests/ledgerEvidence.test.ts` (11) | which claims may rewrite the ledger |
| `gateL0.py` | `tests/gauntletL0Gate.test.ts` (14) | all six gate items, binary, exit-code |

**Suite: 56 files / 894 tests → 59 files / 942 tests green.** tsc ×2 = 0 · eslint = 0.

**Run 1 (dead, usage limit 2026-08-13):** `wf_97ec93a2-3b5` — 20/68 agents done.
Its 12 surveys are preserved in `systems/` and its 8 critic reviews in `critics/`.
**Run 2 (2026-08-14/15):** `wf_7e275b35-488` — relaunched fresh after Stage 0b found
the string table (S0-3), which invalidated run 1's central premise. **Also checkpointed
on a usage limit.** Banked: **all 12 systems re-surveyed** with the string table in
hand (`systems/*.md`, rewritten in place), **336 claims / 256 verdicts / 0 VOID /
56 refuted / 175 ledger overturns**, extracted to `run2/`.

## ▶ SESSION 25 (2026-08-20) — the finish-L0 run is UNDER WAY

**Step 0 landed: `scripts/gauntlet/citeLint.py` + `tests/citeLint.test.ts` (22 tests,
red-first, all six guards chaos-planted).** Suite went 56 files/894 → **57/916 green.**

Deterministic cite audit of all 1,087 claims (`docs/gauntlet/L0/citelint.json`):

```
citeLint: 1087 claims — 872 RESOLVES · 2 BROKEN · 177 QUOTE_UNVERIFIED · 36 UNCHECKABLE
  BROKEN  rebirth/elemental-skill-tooltips  LINE_OOR:.../strings.json:6143>2535; :6146>2535
  BROKEN  rebirth/dragon-dance-teachable    LINE_OOR:.../strings.json:6117>2535
```

Both BROKEN are genuine: the surveyor cited string **IDs** as **line numbers** into a
2,535-line file. Those two cites must be re-formed before either claim enters the ledger.

**`QUOTE_UNVERIFIED` is SOFT by design, and the softness is measured.** In this corpus
`quote` is a prose gloss with verbatim material embedded — *"Visible in the crop: … Code
side: public static var equipment:Vector.\<Item\>"* — so a whole-quote match failed **642
of 1,087**. Quoted-span + XML-run + 6-word-shingle matching cuts that to 177. A gate that
cries wolf 642 times gets ignored, so the script proves what it can prove and routes the
177 to the agent cite-critics as **priority targets**. Hard-fatal stays hard: MISSING_PATH,
LINE_OOR, EMPTY_CITE.

**Also corrected here:** the judged split is **233 / 854**, not 232 / 855 — one `skilldata`
claim did receive a verdict. And §2's L6 *"~150 animations"* is **471**, measured from
`index/android_blobs.json` (`<anim>` summed over the 18 `MCSCharacter_*` blobs;
`99_HumanAnimationData` alone = 158). Not "~450".

### The finish sweep — judged 232 → 582. WALL #6 took 18 of WF-3a's 24 judges.

| Run | Run ID | Agents | Result |
|---|---|---:|---|
| **WF-1** | `wf_54dcdf8e-9a3` | 12 | **4/4 surveys landed** + 4 critics · wall #5 killed 4 critics |
| **WF-2** | `wf_db13a5de-161` | 12 | 6/12 critics · wall #5 killed both lenses of `itemdata` `bindata` `actionscript` |
| **WF-2b** | `wf_b5bca0ad-f47` | 8 | ✅ **`INTEGRITY: CLEAN`** — all 8 returned, 0 died, 0 VOID |
| **WF-3a** | `wf_771ab0e4-798` | 24 | 6/24 judges · **wall #6** killed batches 04–12 outright |

```
run3 (WF-1+WF-2) surveys=4 critics=10 claims=156 verdicts=242   0 BROKEN · 0 VOID
run4 (WF-2b)     surveys=0 critics=8  claims=80  verdicts=280   0 BROKEN · 0 VOID
run5 (WF-3a)     surveys=0 critics=6  claims=37  verdicts=144   0 BROKEN · 0 VOID
```

**273 fresh claims, 0 BROKEN cites. 666 verdicts, 0 VOID.** Against 22-BROKEN-before-fixes
on the pre-citeLint corpus. The machine-check warning in each workflow's LAW block changed
how agents cite.

### ⚑ THE OVERTURN CHECK IS THE HIGHEST-VALUE THING IN THIS LANE

WF-3a's hunter lens must open the `REBUILD_READINESS.md` sentence a finding claims to
falsify, read it in context, and rule separately on whether it actually falls —
`overturn_upheld` is a different boolean from `refuted`, because a finding can be
perfectly TRUE and still not overturn what it points at.

```
overturn rulings 143 — UPHELD 77 · REJECTED 66      (46% rejected)
refuted outright  16
```

**Nearly half of all claimed ledger overturns do not overturn anything.** Without this
check, 66 false overturns would have rewritten the readiness ledger. Two live examples:

- `NF-1-crit-is-deterministic-full-focus` — REFUTED **fatal**. Its 1.5×/1.2× stance-split
  crit is ANDROID-only; the web v0.717 twin at `§1t99s0§.as:3272-3274` is a single arm,
  flat 1.3×. So the ledger's *"Keep CRIT_MULT=1.3"* is **VINDICATED by shipped web code**,
  not killed. What survives is the narrower, real finding: crit is deterministic on a full
  reload bar, plus a flat `STAT_CRITICALDMG` gear term.
- `NF-5-per-stance-damage-multipliers` — true, overturn REJECTED: the ledger's own stance
  table *"dmg 0.9/1.2/1.4"* reproduces **to the digit** from the web expression at mastery 10.

### What is left

```
buildWorklist: 1360 rows -> 1321 distinct ids (39 duplicate rows merged)
  already judged           582
  WF-2 source-sweep claims  15 across 1 packet   (android-blobs — see below)
  WF-3a critic findings    226 across 10 batches x cite+hunter = 20 agents
  WF-3b critic findings    513 across 11 batches x cite = 11 agents
```

⚑ **`buildWorklist` and gate L0-D now ask the SAME two questions.** L0-D caught what the
worklist could not: `android-blobs` had every claim judged by its surviving cite critic
while its hunter lay dead at wall #5, so it vanished from the packet list while still
failing §3.3's two-lens minimum. Judged-ness and lens-coverage are different questions.
A unit now drops out only when it has BOTH no unjudged claims AND two critic lenses on
disk — and when it is short of lenses, the packet carries its WHOLE claim set, because a
hunter that only sees the unjudged remainder cannot hunt what the surviving lens let
through.

`l0-finish-wf2b.workflow.js` is now `l0-finish-source-critics.workflow.js`, carrying all
10 units and taking `{units:[...], lenses:[...]}` from args — so a re-run after a wall
never needs another cloned script.

### ▶ IN FLIGHT, launched 2026-08-20

| Run | Script + args | Agents | What | Run ID |
|---|---|---:|---|---|
| **WF-3a″** | `l0-finish-wf3.workflow.js` `{tier:'t1',batches:3}` | 6 | the 67 overturn-claimers left after WF-3a′ | `wf_9066e979-45c` |
| ~~WF-2d~~ | `l0-finish-source-critics.workflow.js` | 1 | ✅ done — `wf_a8e116f0-38b`, gate L0-D now GREEN | — |
| **WF-3b** | `l0-finish-wf3.workflow.js` `{tier:'t2',batches:13}` | 13 | the 586 corroborating findings | `wf_957bdce7-923` |
| **WF-4** | `l0-finish-wf4.workflow.js` | ~17 | dry-loop x 4 targets (a round only counts if it RAN) + completeness | queued |

⚠ **Always read `batches` fresh from `MANIFEST.json` at launch.** The count MOVES every
run: judged findings drop out and each stage's critics add new ones, so the packets are
renumbered on every build — WF-3a's original 12 batches are now 10. A stale literal
silently drops the tail batches, and a dropped batch leaves those findings UNJUDGED,
which under §0 kills them.

---

### ▶ STATE AT WALL #8 (2026-08-21) — judged **232 → 814**, gate **L0-D GREEN**

Seven runs landed across this session. Every one extracted and committed on the spot.

| Run | Run ID | Agents | Result |
|---|---|---:|---|
| **WF-1** | `wf_54dcdf8e-9a3` | 12 | **4/4 surveys landed** + 4 critics · wall #5 |
| **WF-2** | `wf_db13a5de-161` | 12 | 6/12 critics · wall #5 |
| **WF-2b** | `wf_b5bca0ad-f47` | 8 | ✅ **CLEAN** — 0 died, 0 VOID |
| **WF-3a** | `wf_771ab0e4-798` | 24 | 6/24 · wall #6 |
| **WF-2d** | `wf_a8e116f0-38b` | 1 | ✅ **CLEAN** — closed gate L0-D |
| **WF-3a′** | `wf_88793137-368` | 20 | **19/20, zero unjudged batches** · 1 API error |
| **WF-3a″ + WF-3b** | `wf_9066e979-45c` · `wf_957bdce7-923` | 19 | ⛔ **0/19 — wall #8 took both outright** |

```
run3 (WF-1+WF-2) critics=10 claims=156 verdicts=242   0 BROKEN · 0 VOID
run4 (WF-2b)     critics=8  claims=80  verdicts=280   0 BROKEN · 0 VOID
run5 (WF-3a)     critics=6  claims=37  verdicts=144   0 BROKEN · 0 VOID
run6 (WF-2d)     critics=1  claims=10  verdicts=15    0 BROKEN · 0 VOID
run7 (WF-3a′)    critics=19 claims=136 verdicts=448   0 BROKEN · 0 VOID
```

**419 fresh claims, 0 BROKEN cites. 1,129 verdicts, 0 VOID.**

**Overturn rulings so far: 580 — UPHELD 352 · REJECTED 210 (36% rejected).**

### ⚑ §6 — EVERY "STRUCTURALLY UNRECOVERABLE" ENTRY IS OVERTURNED

| §6 entry | surviving, judged overturns |
|---|---:|
| L11–80 XP curve | **16** |
| Verbatim dialogue | 8 |
| Server-sim topology & save format | 7 |
| Exact original SFX & music synthesis params | 4 |
| The live clan-war | 4 |
| The dead IAP economy | 3 |

Gate **L0-E** permits an EMPTY §6 outright — *a provably minimal list may be empty*, with a
test pinning it. Any entry that survives must carry a **pasted negative search**.

### ⚑ WALL #8 EXPOSED A REAL DEFECT — FIXED

Both runs reported **0 agents done**, yet **7 critic reviews were on disk**. The
write-to-disk-before-returning rule paid out an eighth time: prose recovered, structured
verdicts lost. But three of those files had **overwritten run7's committed reviews**,
because `buildWorklist` **renumbers batches on every build** — `t1-overturns-01` names a
different claim set each run, so `<batch>.<lens>.md` collides. Git had the originals; that
was luck, not design.

**Fixed:** `l0-finish-wf3` and `l0-finish-wf4` now take a `tag` from args and write
`<batch>.<lens>.<tag>.md`. **Always pass a run-unique tag.** The orphaned prose is
preserved under `critics/orphaned/` with a README — kept as a record, and explicitly NOT
an input for the blind re-judge (§3.2).

⚠ **Those claims are still UNJUDGED and `buildWorklist` still lists them, correctly.**

---

### ⚑ THREE STAGE-0 FACTS THIS LANE OVERTURNED — carried into every later prompt

WF-2d was ONE agent, and it corrected two things this lane had been repeating — including
one of the standing warnings the workflow briefs carry. A claim repeating the OLD version
is now auto-REFUTED.

**C1 — the blob encoding rule was over-general in the direction that HIDES CONTENT.**
The brief said *"the Android blobs are UTF-16LE"*. Magic-byte census over all 42:

| count | kind | how to read it |
|---:|---|---|
| 36 | plain text | grep works |
| 1 | UTF-16LE (BOM `fffe`) | `118_Mobile_Lang_EN.bin` only |
| 5 | XOR'd zlib SWF (magic `CW`) | `113` `115` `120` `122` `124` → `ResourceManager.decryptByteArray`, key `'m'`=109 (`Mobile.as:352`), then inflate |
| 1 | GIF89a 63×72 (magic `GI`) | `110_Mobile_MapBitmapData.bin` |

A plain grep of those **six** returns 0 hits for content that IS there — the real
false-negative trap, and what hid the portrait, icon and audio inventories.

**C2 — the S0-3 parity caveat is UNDISCHARGED, and the "byte-identical" proof was CIRCULAR.**
Verified first-hand this session: the web payload carries **ZERO** `<questdata>`,
`<skilldata>`, `<npcdata>` or `<itemdata>` roots — not in `payload.xml`, not in any of the
27 web bindata files.

```
<questdata> in web bindata: 0 files · in payload.xml: 0     (same for the other three)
```

So `reference/extracted/{questdata,skilldata,npcdata,itemdata}.xml` came from the **ANDROID**
build, and diffing them against the Android blobs compares a file with itself. ⚠ **This
reverses an earlier WF-2 critic's claim that `questdata` had "no parity hole".** Every row
ported from those four files is **v0.682 until a WEB-side artifact says otherwise** —
which raises build-parity risk for L1, L2, L3 and L4, the lanes that port them.

**C3 — S0-5 IS DEAD: THE AUDIO IS RECOVERED, NOT ENCRYPTED.** Survived **8 critics**.
`122_Mobile_SoundResource.bin` decodes at XOR key 111 into a valid CWS v17 SWF with 13
`DefineSound` tags plus a SymbolClass table naming every SFX, all extracted to playable
MP3. Also held: **13 named music stems** (six overworld at exactly 79.872 s, four dungeon
at exactly 45.760 s — bit-identical lengths are the mechanism that lets them layer in
phase), the **adaptive-music engine** (17 boolean presets over the 13 stems, crossfade
±0.05/tick, a new stem entering at the anchor stem's playhead), and the **SFX playback
contract**. §6's *"Exact original SFX & music synthesis params ... are not [study-able]"*
is dead, and **L7's gate changes character** — the target is now exact, not inferred.

✅ **`l0-finish-wf3.workflow.js` was patched the moment WF-3a′ landed**, before WF-3a″ and
WF-3b launched on it. All three finish-lane scripts now carry the CORRECTIONS block.

---

### THE LEDGER REWRITE'S ONLY ADMISSIBLE INPUT — `buildLedgerEvidence.py`

The rewrite has exactly one legal input under §0: claims that were **JUDGED and
SURVIVED**. Deciding that by reading 1,321 claims by hand is how a refuted claim slips
back in, so a script does it and gate **L0-B** independently re-checks whatever the
rewrite ends up citing.

```
buildLedgerEvidence: 1321 claims — 394 UPHELD · 16 NOT-UPHELD · 911 KILLED
  256 surviving overturns on 166 distinct ledger sentences
  15 claimed overturns REJECTED (true finding, wrong target)
```

**KILLED 911 = 739 still UNJUDGED + 172 genuinely REFUTED.** The unjudged half shrinks
as WF-3a′ and WF-3b land; it is counted as KILLED because §0 gives no third option —
an unjudged claim is a LEAD and may not enter the ledger.

**The three-way status is the point.** `NOT-UPHELD` exists because *"true"* and
*"overturns the thing it says it overturns"* are DIFFERENT QUESTIONS. Collapsing them is
how a readiness ledger gets rewritten by findings that never contradicted it.

`LEDGER_EVIDENCE.md` groups the surviving overturns **by the ledger sentence each one
names**, so the rewrite works sentence by sentence instead of claim by claim. The lines
taking the most fire right now:

| ledger sentence | surviving findings |
|---|---:|
| ③ FX **blend modes** | 7 |
| ① what each element **does** (24 skills' damage/cost/AoE/status — names only) | 6 |
| ④ Dragon Dance **input** + Kanji-statue bonus | 5 |
| **The stance tables are MASTERY-9 CEILING values, not base** | 5 |
| **Server-sim topology & save format** — *"nothing to copy"* (a §6 unrecoverable) | 4 |
| ① **ALL AUDIO** — *"every SFX + music param is INFERRED"* | 4 |
| ⑤ **sprite-compositing contract** + item **icon manifest** | 4 |
| Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru | 4 |

---

### THE BINARY GATE — `scripts/gauntlet/gateL0.py`, 6 items, all currently RED

`GAUNTLET.md` §3.6: *"Binary. Every item green with pasted output, or the lane is open.
Never soften a gate to fit a result."* A gate a human eyeballs is a gate that gets
softened, so every item is decided mechanically and the script exits non-zero if any is
red. 14 hermetic tests, watched RED at 13/13, all seven guards chaos-planted.

```
GATE L0 — 1323 claims pooled · 510 judged ids · 0 ledger references
   RED   L0-A  CITE INTEGRITY        the ledger cites no claim at all — the rewrite has not happened
   RED   L0-B  NOTHING UNJUDGED      same
   RED   L0-C  CONVERGENCE IS REAL   no convergence receipt — the dry-loop has not run
  GREEN  L0-D  EVERY SOURCE OPENED   all 10 sources surveyed with >= 2 critics each ✅
   RED   L0-E  §6 PROVABLY MINIMAL   6 entries kept with no pasted negative search
   RED   L0-F  SCORECARD EVIDENCE    12 system scores carry neither a [[claim]] nor a STILL_UNHELD
LANE L0: ⛔ OPEN — at least one gate item is RED
```

**How the ledger will carry its evidence:** the rewrite cites claims inline as
`[[unit/claim-slug]]`, and L0-B resolves every reference against the pooled verdicts. A
claim with no verdict, whose only verdicts are VOID (no `own_cite`, §0), or that the
critics refuted turns the gate red and names itself. That is §0's *"an unjudged claim is
a LEAD"* made mechanical — the rule does not break because someone decides to break it,
it breaks when a claim quietly drifts into a rewrite nobody re-checked.

⚑ **The gate had its own fail-open and it is closed.** With an un-rewritten ledger,
"every cited claim resolves" and "every cited claim was judged" are both VACUOUSLY TRUE
over an empty set — L0-A and L0-B reported GREEN on a lane that had done none of the
work. Both now go RED when the ledger cites nothing.

⚑ **L0-D immediately caught a real gap the worklist could not.** `android-blobs` has only
its `cite` critic: the `hunter` died at wall #5, and because the surviving critic HAD
judged every claim, the unit dropped out of `buildWorklist`'s packet list. Judged-ness and
§3.3's two-lens minimum are different questions, and only the gate asks the second.
**One agent owed: `android-blobs:hunter`.**

---

---

**STATE AFTER 4 EARLIER RUNS (last: 59/79 agents, 2026-08-15).**

**1,087 claims · 1,767 verdicts · 0 VOID · 349 refuted · 483 claimed ledger overturns.**
`INTEGRITY: INCOMPLETE — converged=false` (correct, and loud).

| Unit | Claims | Judged | Overturns | |
|---|---:|---:|---:|---|
| **all 12 systems** | **232** | **232** | 140 | ✅ **COMPLETE — 3-4 blind critics each; these may enter the ledger** |
| `skilldata` (one claim) | — | **1** | — | judged; counted in the 233 total |
| `skilldata` source sweep | 42 | 1 | 27 | ⚠️ partial |
| `actionscript` `bindata` `itemdata` `npcdata` `questdata` sweeps | 168 | 0 | 106 | ❌ leads — surveys done, critics never ran |
| critic `new_findings` | 645 | 0 | 210 | ❌ leads — uncritiqued by construction |

**233 claims are judged and may be written into the ledger. The other 854 are leads.**

Transcripts: `~/.claude/projects/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/subagents/workflows/<runId>/`

**Why run 2 is a fresh run and not a resume:** run 1's surveys were written believing
item/skill/NPC names were unresolvable (`GAUNTLET.md` §2.1). S0-3 disproved that —
804/73/484 names now resolve. Their `STILL_UNHELD` verdicts are systematically wrong
in one direction, so they are round-1 input, not results. Nothing was discarded.

**Two fail-open bugs were fixed in the orchestration before run 2** (commit `6ff47f1`):
`harvest()` used to promote claims that NO critic had judged into `confirmed`, and the
loop-until-dry used to count a round where every hunter *died* as a round that found
nothing. Run 1's headline numbers (`confirmed: 225`, `dry_rounds: 2`) were products of
both bugs and must not be quoted. Run 2 returns an `INTEGRITY` string and a separate
`unjudged` bucket so this cannot recur silently.

## ⚠️ Still outstanding

- **4 source surveys never run** — `android-blobs`, `string-table`, `frames`,
  `uistrings-payload`. The first two have **never been opened by any agent** in four
  runs, and they are where the remaining value is concentrated.
- **~12 source critics** — the 6 completed source sweeps were never judged.
- **645 critic `new_findings`** carrying **210 claimed ledger overturns** — unjudged
  by construction, therefore unusable until critics run.
- **Dry-loop** (never completed a round that actually ran) · **completeness critic**.
- **Gates L0-A…F**, the `REBUILD_READINESS.md` rewrite, and the §3.7 re-arm commit.
- **`GAUNTLET.md` itself is now wrong in three places** — §2.1's string-table blocker
  is dead (S0-3), the **L1b lane row is obsolete** (closed before it ran), and §2's
  L6 "~150 animations" is really ~450 (S0-4). Correct these in the re-arm commit.

## How to resume — ⛔ READ THIS BEFORE TOUCHING THE WORKFLOW

**`resumeFromRunId` is SAME-SESSION ONLY.** Run `wf_7e275b35-488` belonged to the
session that ended 2026-08-15. **A new session CANNOT resume it** — passing that run
ID will not restore the cache, and re-running `l0-resurvey.workflow.js` unmodified
would re-execute all 59 completed agents for nothing.

**This does not cost you anything, because the cache is no longer load-bearing:**
every completed agent's output is already extracted to `run2/claims.json`,
`run2/verdicts.json`, `run2/CLAIMS.md`, `systems/*.md`, `sources/*.md` and
`critics/*.md`, and committed.

### ✅ The correct move: write a FRESH, SMALLER "finish-L0" workflow

Do **not** re-run the 79-agent script. Author a new one that reads the on-disk state
and runs **only what never executed** (~40 agents):

| Stage | Agents | What |
|---|---:|---|
| **A** | 4 | The source surveys that never ran: `android-blobs` (the 42 named Android blobs), `string-table` (2,533 strings, never read for mechanics), `frames`, `uistrings-payload` |
| **B** | ~12 | The `cite` + `hunter` critics for all 6 completed source sweeps (`questdata` `skilldata` `npcdata` `itemdata` `bindata` `actionscript`) — their surveys are in `sources/*.md`, feed those in as input rather than re-surveying |
| **C** | ~20 | Judge the **645 uncritiqued `new_findings`** (210 claimed overturns currently unusable). Batch them; do not spawn one agent per finding |
| **D** | 3–6 | Dry-loop until two rounds that ACTUALLY RAN find nothing new |
| **E** | 1 | Completeness critic |

Reuse the prompt builders and the schemas from `l0-resurvey.workflow.js` verbatim —
`LAW`, `INDEX_BRIEF`, `CLAIM_SCHEMA`, `SURVEY_SCHEMA`, `CRITIC_SCHEMA` — and keep the
fixed `harvest()` / dry-loop accounting (see below; those two fixes are why this
lane's numbers can be trusted at all).

## Re-extract either journal at any time

```
python3 scripts/gauntlet/salvageJournal.py docs/gauntlet/L0/wf-journal-run2.jsonl --out docs/gauntlet/L0/run2
python3 scripts/gauntlet/salvageJournal.py docs/gauntlet/L0/wf-journal.jsonl      --out docs/gauntlet/L0
```

## Rebuild the Stage-0 evidence index from scratch

Both scripts are idempotent and need only `reference/` (gitignored study material):

```
python3 scripts/gauntlet/payloadIndex.py            # web payload, 9 index files
python3 scripts/gauntlet/androidIndex.py --export   # Android blobs + THE STRING TABLE
```
