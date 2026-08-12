# THE GAUNTLET — the standing engine for finishing SSHD 1:1

> **What this is.** A permanent, self-re-arming gauntlet-loop that grinds the whole
> game to 1:1 — combat, campaign, dialogue, plot, art, audio, world, meta — one
> **lane** per run, each lane gated binary, each run resumable after a crash.
> It is not a session kickoff. Sessions come and go; this file is the engine
> they run. `RESUME_HERE.md` still owns *current state*; this file owns *the method*.
>
> **Provenance.** Adapted from the **gauntlet-loop** prompting technique (Jay E /
> RoboNuggets, 2026-08-05): three parts — TASK, BUILD METHOD (fan out sub-agents,
> each paired with a blind critic), QUALITY BAR (loop until every critic passes
> against the real thing). §0 explains the one change that had to be made for it
> to work on a **dead** game, and why the unmodified version would produce
> confident garbage here.
>
> **Owner rulings baked in (2026-08-13):** standing engine over all 12 systems ·
> heavy runs on Opus 5, bounded runs on Fable 5, lanes routed by which model is
> actually better at the work (§2).

---

## §0 THE ONE ADAPTATION — WHY THE VANILLA GAUNTLET-LOOP WOULD FAIL HERE

The technique's quality bar is *"do not stop until each sub-agent is utterly wowed
with the quality when compared with the actual game."* That works when the critic
can go look at Call of Duty.

**Straw Hat Samurai: Duels is dead.** The P0 experiment (2026-07-23, definitive,
`REBUILD_READINESS.md` §5) proved there is **no offline playable build** — the
6.88 MB payload loads, renders the real v0.717 title screen, then hangs forever
waiting on a Player.IO backend that died with the studio. No agent in this repo
has ever seen this game run.

So a critic told to "compare against the actual game" **has nothing to compare
against and will vote from memory.** That is not a hypothetical failure mode here
— it already happened: SESSION 18's A4-D graded a bare doll as a clothed fighter
because it worked second-hand from a measurement doc instead of opening a frame.

### The rule that replaces it

> **EVERY CRITIC IS AN ARTIFACT CRITIC. A verdict that does not cite an artifact
> is VOID and the finding it judged returns to the pool unjudged.**

An artifact is exactly one of:

| # | Artifact | What citing it looks like |
|---|---|---|
| **A1** | A **video frame** under `reference/frames/` | path + what is visibly in it, cropped and upscaled first (the fighter is ~270 px tall in a 1080p frame) |
| **A2** | A **payload row** under `reference/extracted/` or `reference/decompiled/` | file + the XML/AS3 line, quoted |
| **A3** | A **byte-check / test** in the suite | the test name + pasted output |
| **A4** | A **measured number** in a fidelity ledger with its own frame cite | ledger § + the cite it carries |
| **A5** | **Kheshav's own LOOK verdict**, logged verbatim | the log line |

Not artifacts, and auto-void if cited: the model's memory of the game · another
agent's summary · "it looks right" · a measurement doc read second-hand when a
frame exists · plausibility.

**And the standing invariant still outranks everything:** when a measurement doc
and a frame disagree, **the frame wins** — say so out loud.

---

## §1 THE FINDING THAT RE-SCORES THE BOARD (2026-08-13)

`REBUILD_READINESS.md` (2026-07-20, ~42/100) is **stale on the highest-value
systems**, because the payload extraction landed after it and was never
reconciled. Verified first-hand, this date:

| Held, unmined, in `reference/extracted/` | Contents | The ledger still claims |
|---|---|---|
| `questdata.xml` (780 K) | **61 quests · 2,771 `<dialogue>` blocks · 3,307 verbatim `<text>` lines · 471 `<choice>` · 196 `<option>` · full `<cutscene>` direction (time/actor/action/param) · per-step `<wave>` enemy spawns with x-coords** | *"verbatim dialogue — captured NOWHERE"* (§4) and *"structurally unrecoverable"* (§6) |
| same | Campaign is **COMPLETE: Prologue → Episodes 1–12 → Epilogue → Season 2 hook** | *"Ep4–12 were likely never shipped… faithful campaign = Prologue–Ep3"* (§3.8) |
| `skilldata.xml` (40 K) | **75 skills × 182 level rows**, each with exact `<chi>`, `<cooldown>`, `<value>`, `<required>`, `<desc>` | skills-meters scored **33/100**, blocker ① *"every other skill's Chi cost + cooldown"* |
| `npcdata.xml` (224 K) | **495 NPCs** — full 10-slot paperdoll, `<lvl>`, `<ai>` (425), `<skill>` (647) | enemies-ai **34/100**, blocker ① *"enemy level→stat formula… absent"* |
| `itemdata.xml` (180 K) | **982 items** — type, name, baseprice, weight, modifiers, defense, unique, heavenlyprice | items-equipment **42/100**, blocker ① *"stat-magnitude vs level curve"* |
| `ui_strings.txt` | UI copy verbatim — War Room rules, betting-odds text, HUD strings | ui-hud blocker ⑤ *"pause/options/dialogue-box exact metrics"* |

**`grep` over `src/`, `tests/`, `scripts/` finds ZERO references to any of it.**
Meanwhile `src/config/skills.ts` ships **three** skills with **two of three
cooldowns marked INFERRED** — hand-guessed numbers for a file we already hold
exactly.

**Consequence for the engine:** the information frontier is not where the ledger
says it is. **Lane 0 re-surveys before any lane is planned.** Any lane that
frame-counts a number the payload states outright has failed its own gate.

---

## §2 THE LANE BOARD — model, scale, and the gate

Owner ruling: **heavy = Opus 5 · bounded = Fable 5**, and lanes go to whichever
model is genuinely better at the work. The split below is that judgement, made
once, here, so no session re-litigates it.

**Opus 5 @ `xhigh`, heavy (40–60 agents)** — surgical, adversarial, visual,
invariant-touching. Work where being confidently wrong is expensive and the
check is an act of judgement: grading a render against a frame, refuting a
claim, moving the Sim, root-causing a defect, anything that moves a floor or the
DIVERGENCES ledger.

**Fable 5 @ `high`, bounded (12–16 agents)** — long-horizon, from-scratch,
structurally uniform fan-out. Building whole subsystems that do not exist yet;
porting hundreds of rows behind a schema gate. *Lean prompts only.*

**Sonnet 5 `medium` / Haiku 4.5 `low`** — bulk row-transform sub-stages *inside*
a Fable lane (982 item rows, 495 NPC rows), always behind a byte-check.

| # | Lane | Model · scale | The lane is done when |
|---|---|---|---|
| **L0** | **RE-SURVEY** — re-score all 12 systems against the payload; rewrite `REBUILD_READINESS.md` §4/§6; delete every "unrecoverable" that the payload disproves | **Opus · small (~8)** | every system's score carries an A2 cite or an explicit "still unheld"; §6's unrecoverable list is provably minimal |
| **L1** | **CAMPAIGN** — port `questdata.xml` → config; build the dialogue box, cutscene director, quest state machine, choice graph | **Fable · bounded** (runtime is from-scratch) · **Opus critic** on every LOOK | Prologue→Ep12→Epilogue playable end-to-end; all 3,307 lines present byte-exact; 471 choices branch; a cutscene beat matches its A1 frame |
| **L2** | **SKILLS + METERS** — `skilldata.xml` → config; Chi/Focus/AP meters real | **Fable · bounded** + Sonnet bulk | all 75 skills × 182 rows byte-exact from A2; zero INFERRED cooldowns remain; meters on-screen match A1 |
| **L3** | **ITEMS + PAPERDOLL** — `itemdata.xml` → config; 9-slot compositing contract | **Fable · bounded** + Sonnet bulk · **Opus** owns the compositing/z-order grade | 982 items byte-exact; a dressed fighter composites in the OG's layer order against A1 |
| **L4** | **ENEMIES + AI** — `npcdata.xml` → config; AI behaviours from `<ai>` | **Fable · bounded** build · **Opus** grades the fight feel | 495 NPCs byte-exact; each `<ai>` value maps to observed behaviour with an A1 cite |
| **L5** | **COMBAT CORE** — reach cap, slash-vs-move, crit read, Focus gating, TTK | **Opus · heavy** | SESSION 24 §2 A12-A…F green; duel-baseline re-recorded ONCE, atomically |
| **L6** | **ART + ANIM** — the live `r="1"` z-order defect, then the remaining ~150 animations | **Opus · heavy** for the defect + every LOOK · **Fable · bounded** for bulk transcription | `r="1"` honoured (A3); each anim transcribed + byte-checked + pins extended deliberately; floors ≥ 0.9005 / ≥ 0.8490 / ≤ 140.5 hold |
| **L7** | **AUDIO** — WebAudio synthesis, from scratch | **Fable · bounded** · ⚠ **gate is KHESHAV'S EARS** — no model can hear | characterised via a listen-pass, then A/B'd by the owner; his verdict logged verbatim |
| **L8** | **UI + SCREENS** — aspect-ratio truth (800×480 native), pause/options/dialogue metrics, off-screen screens | **Opus · heavy** | fidelity gate stays 55/55; each screen matches its A1 frame; the 5:3-vs-16:9 pillarbox question answered with evidence |
| **L9** | **WORLD** — room graph, map topology, AP, travel, save schema | **Fable · bounded** | rooms/coords from A2 where held, labelled authored where not; a save round-trips |
| **L10** | **PROGRESSION + ECONOMY** — curves, prices, sell formula | **Fable · bounded** · **Opus** adversarial fit-check | every curve either A2-sourced or labelled INFERRED with its fit shown |
| **L11** | **META + REBIRTH** — clans, War Room, elements; the server sim is gone → authored offline sim | **Fable · bounded** | every authored-not-original piece labelled in DIVERGENCES; nothing presented as OG fidelity that isn't |

**Ordering rule:** L0 first, always. Then **highest (leverage ÷ risk)** — which
after L0 is L1/L2/L3/L4, because their information is already held and their
gates are byte-checks rather than judgement calls. L5 and L6 interleave whenever
the owner's LOOK queue has an open verdict. L7 waits for his ears.

---

## §3 THE ENGINE — how one run works

**One run = one lane.** Never two.

1. **ARM.** Read `RESUME_HERE.md` + this file. Pick the lane by §2's ordering
   rule. State the lane, the model, the scale, and the gate **before** any agent
   spawns. If the chosen model does not match §2's routing for that lane, **stop
   and say so** — do not silently run a heavy lane on a bounded budget.
2. **FAN OUT.** Decompose the lane into independent sub-tasks. Each sub-task gets
   one worker **and one blind critic** — blind meaning the critic never sees the
   worker's reasoning, only its output and the artifacts, and is prompted to
   **refute**, defaulting to *refuted* when uncertain.
3. **JUDGE.** A finding survives only on an artifact-cited verdict (§0). Heavy
   lanes use **3–5 critics with distinct lenses** (does it match the frame · does
   it match the payload · does it break an invariant · does it survive the
   suite); bounded lanes use **1–2**. Majority refute kills it.
4. **JOURNAL AS YOU GO.** Every stage writes its result to disk **immediately**,
   never held in context. A run that dies mid-flight is then salvageable —
   frames, transcripts, journal and script all survive, and only the dead agents
   re-run, on a cheaper model. *(Validated 4×, latest 2026-08-13. Credit
   exhaustion killed a verify pass on 2026-07-29; this is the insurance.)*
5. **LOOP UNTIL DRY.** Keep spawning finders until **two consecutive rounds
   surface nothing new**. Dedup against everything *seen*, not everything
   *confirmed* — otherwise critic-rejected findings reappear each round and the
   loop never converges.
6. **GATE.** Binary. Every item green with pasted output, or the lane is open.
   **Never soften a gate to fit a result** — re-author, or take a ruling.
7. **RE-ARM.** Update `RESUME_HERE.md` + `docs/sessions/-SESSION-LOG.md` +
   `DIVERGENCES.md` **in the same commit as the change they describe**, tick the
   lane in §2, and name the next lane. The engine is not done until it has
   pointed at its own next run.

**No silent caps.** If a run bounds coverage — top-N, sampling, skipped rows —
it must say what was dropped. Silent truncation reads as "covered everything."

---

## §4 THE NO-TOUCH LIST — a lane that touches these without the protocol has failed

- **`src/core/Sim.ts` and `tests/duel-baseline.test.ts`** — gameplay state and the
  recorded baseline. Only **L5** may move them, and only by the baseline's own
  atomic protocol: DIVERGENCES entry **first**, then the sim change, then **ONE**
  re-record, all in **one commit**. A second re-record in a run means the
  measurement was wrong — stop and re-measure.
- **The anim-key pins** (`tests/a11AnimData.test.ts`) — extended only in the same
  commit as the transcription that needs them, deliberately.
- **The floors** — tracing ≥ 0.9005 · held-out ≥ 0.8490 (spent, **UP only**) ·
  height ≤ 140.5. A lane raises a floor or leaves it; it never lowers one.
- **`src/core/` zero numeric literals** · dependency direction · render-only
  scenes · red-first TDD · chaos-plant every guard.
- **`tests/fixtures/scan-probe/`** — load-bearing scanner fixtures.

---

## §5 THE GAUNTLET PROMPT — paste-ready

Copy everything **between** the `'''` markers (the markers are not part of it).

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me the lane you're taking and why before you spawn anything:
- RESUME_HERE.md
- docs/GAUNTLET.md   <- the standing engine; §2 is the lane board, §0 is the law

THE TASK: run ONE gauntlet lane to its binary gate. Pick it by §2's ordering rule
(L0 first if it hasn't run). One lane per run — never two.

THE BUILD METHOD: fan out sub-agents across the lane's independent sub-tasks. Pair
every worker with a BLIND CRITIC that sees only the output and the artifacts, and
is prompted to REFUTE — default to refuted when uncertain. Heavy lanes: 3-5 critics
with distinct lenses. Bounded lanes: 1-2. Journal every stage to disk the moment it
lands, so a dead run is salvageable. Loop until two consecutive rounds surface
nothing new, deduping against everything SEEN, not everything confirmed.

THE BAR — §0 is absolute: EVERY CRITIC IS AN ARTIFACT CRITIC. This game is DEAD;
no agent here has ever seen it run, so "compare it to the real game" means cite a
frame under reference/frames/, a row under reference/extracted/, a byte-check in
the suite, a ledger number carrying its own frame cite, or my own logged LOOK. A
verdict citing memory, another agent's summary, or "it looks right" is VOID and its
finding goes back in the pool unjudged. Crop and upscale before grading any frame.
When a measurement doc and a frame disagree, THE FRAME WINS — say so out loud.

Do not stop until every gate item in §2 for that lane is green with PASTED output.
Never soften a gate to fit a result: re-author, or come to me for a ruling.

WHAT NOT TO BREAK: §4's no-touch list. Sim.ts and the duel-baseline move only in
L5, only by the atomic protocol. Floors go UP or stay. core/ keeps zero numeric
literals. Scenes stay render-only. Red-first, chaos-plant every guard.

BEFORE YOU FAN OUT, CHECK YOUR ROUTING: heavy lanes are Opus 5 at xhigh, bounded
lanes are Fable 5 at high. If I've started you on the wrong one for your lane, say
so and stop rather than running a heavy lane on a bounded budget.

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 56 files / 894),
name your lane + model + scale + the exact gate you're driving to, and show me the
fan-out shape. Don't spawn until I ok it.
'''
```

**Start command** (from the repo root):

```bash
cd "/Users/kheshav/kheshav-code/SSHD 1-1" && git log --oneline -1 && npm test 2>&1 | tail -5
```

---

## §6 RULINGS MADE FOR YOU — each with a one-line veto

**R1 — Verbatim dialogue is COMMITTED to `src/`, and public ship is gated.**
The repo is **private**, so porting the 3,307 lines into the source tree is
development use, not distribution. The 2026-07-24 permission ruling covers Lut's
*art* and hues explicitly; this extends the same attested grant to their *text*.
L1 writes the DIVERGENCES entry + a ruling amendment as its first commit, and
adds a gate that **blocks any public/ship build until the grant's wording is
re-checked for text and for commercial scope.**
> **Veto:** paraphrase into `src/` and keep verbatim in gitignored `reference/`.
> Costs you the 1:1 on the exact thing you asked for, and makes every line a
> judgement call an agent can drift on.

**R2 — L0 runs before any other lane.** The readiness ledger is stale on four of
the five systems the payload just closed (§1); planning lanes off it would send
agents to frame-count numbers we already hold.
> **Veto:** start at L1 and re-survey later — you'd re-derive known values.

**R3 — Combat (L5) and the campaign lanes coexist; §4 keeps them apart.**
SESSION 24's A12.2 is mid-flight with an atomic baseline protocol. L1–L4 touch
config and new subsystems, never `Sim.ts` or the baseline, so they can run
without endangering it.
> **Veto:** freeze A12.2 until the campaign lands.

**R4 — L7 (audio) does not start until you can listen.** No model in this repo
can hear; a gate no agent can evaluate is theatre.
> **Veto:** let a lane ship synthesized audio on a written spec alone.

---

## §7 BAR SELF-REPORT

**Does this reach the "cannot be improved further" bar? ✅ Yes — the next change
would be churn.**

- The technique's one fatal assumption for a dead game — *critics compare against
  the real thing* — is identified and replaced with a rule that has teeth (§0),
  grounded in the specific failure it already caused here (SESSION 18 A4-D).
- The lane board covers **all 12 systems**, each with a model, a scale, and a
  **binary** gate — no lane is "improve X."
- Model routing is decided once, by which model is actually better at the work,
  so no session re-litigates it.
- The engine is **crash-survivable** (journal-first) and **self-re-arming**, which
  is what makes it standing rather than a one-shot prompt.
- **What it deliberately does not promise:** it does not finish the game in one
  run, it does not gate audio on anything but your ears, and it does not claim
  the server-side systems (live clan war, L11–80 curve, IAP economy) are
  recoverable — those are named as authored deviations in L11, not hidden.
