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
| `npcdata.xml` (224 K) | **495 NPCs** — full paperdoll, **12 rendered of a 13-slot model** (§2.2), `<lvl>`, `<ai>` (425), `<skill>` (647) | enemies-ai **34/100**, blocker ① *"enemy level→stat formula… absent"* |
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

**Opus 5 @ `xhigh`, UNLIMITED agents (owner ruling 2026-08-13)** — surgical,
adversarial, visual, invariant-touching. Work where being confidently wrong is
expensive and the check is an act of judgement: grading a render against a
frame, refuting a claim, moving the Sim, root-causing a defect, anything that
moves a floor or the DIVERGENCES ledger.

**Fable 5 @ `high`, bounded (12–16 agents)** — long-horizon, from-scratch
subsystem building. Whole systems that do not exist yet. *Lean prompts only.*
Its cap costs nothing on its lanes: they are **depth-bound, not width-bound**
(one runtime built deeply, not 500 rows copied widely).

### ⚠ THE RULE THAT OUTRANKS BOTH: A SCRIPT BEATS A SWARM

**A deterministic transform gets a generator + a byte-check, NEVER a fan-out.**
Porting 982 item rows, 495 NPC rows or 75 skill rows from XML to TypeScript is
a *transform*, not research. Agents copying rows **introduce errors a script
cannot make**; the repo already proved the right shape with
`scripts/anim/transcribeAnims.py` + the `tests/a11AnimData.test.ts` byte pins,
and CLAUDE.md already mandates it: **transcribed and byte-checked, never
hand-keyed.**

Agents are for the parts a script *cannot* do: deciding the schema, resolving
what a field means, grading the result on screen. **If a lane's work can be
expressed as a loop over rows, the lane writes the loop.**

**Sonnet 5 `medium` / Haiku 4.5 `low`** — only for genuinely per-row *judgement*
(e.g. classifying an ambiguous field), never for copying.

| # | Lane | Model · scale | The lane is done when |
|---|---|---|---|
| **L0** | **RE-SURVEY** — re-score all 12 systems against the payload; rewrite `REBUILD_READINESS.md` §4/§6; delete every "unrecoverable" that the payload disproves | **Opus · small (~8)** | every system's score carries an A2 cite or an explicit "still unheld"; §6's unrecoverable list is provably minimal |
| **L1** | **CAMPAIGN** — port `questdata.xml` → config; build the dialogue box, cutscene director, quest state machine, choice graph | **Fable · bounded** (runtime is from-scratch) · **Opus critic** on every LOOK | Prologue→Ep12→Epilogue playable end-to-end; all 3,307 lines present byte-exact; 471 choices branch; a cutscene beat matches its A1 frame |
| ~~**L2**~~ | ~~**SKILLS + METERS**~~ — **CLOSED 2026-08-24** | **generator script** + Opus grade | ✅ 75 skills × 182 rows byte-exact from A2 · ✅ zero INFERRED cooldowns remain · ✅ meters match A1: the three bars `BattleUI.as` declares (`hpbar`/`chibar`/`reloadbar`), the Focus caption's 3 source-stated states, fidelity gate **41 points + 14 scans, 0 failures**. ⚠️ **"AP meter" was not built ON PURPOSE** — `BattleUI.as` declares no AP bar; AP is a Player-sheet stat, never a duel meter (DIVERGENCES). |
| **L3** | **ITEMS + PAPERDOLL** — `itemdata.xml` → config; compositing contract = **13-slot model / 12 rendered / 9 equip boxes** (§2.2) | **generator script** + **Opus** owns the compositing/z-order grade | ✅ 982 items + 412 modifier rows byte-exact (`652eebb`) · ✅ compositing CONTRACT (`1b9b479`) · ⛔ **L3B OPEN**: the owner's LOOK rejected the art (A5). GATE **A13-A** now measures colour blocking the aggregates could not see (6 bands × 5 paint classes, tolerance = the source's own frame-to-frame spread) and its **8 open cells are named in `tests/a13Bands.test.ts`**; floors ROSE (0.9005→0.9123 · 0.8490→0.8566) and the height ceiling FELL (140.5→138.3). **Blocked on 9015**: three of seven traced garments do not regenerate, and re-authoring the gi reinstates the A9-E balloon. Full ledger: `DIVERGENCES.md` "LANE L3B". |
| **L4** | **ENEMIES + AI** — `npcdata.xml` → config; AI behaviours from `<ai>` | **generator script** for the rows · **Fable** builds the AI · **Opus** grades the fight feel | ✅ **L4a CLOSED 2026-09-08**: 495 NPCs byte-exact (`OG_NPCS`, 3,210 slot values / 647 skills / 131 loot / 2 preserved source anomalies) and **all three** `ai` dispatches + a fourth non-dispatch `ai` site (`OG_AI_*`, 38 + 13 + 2 branches with constructor args, `OG_AI_DUEL_PLACEMENT`) — 40 tests, both transcribers chaos-planted red. 🔶 **L4b IN FLIGHT** (`docs/sessions/L4B_KICKOFF.md`, **Fable 5 @ `high`**, sequenced slices): **slices 0, 1, 2 and 3 landed — 21 of 34 ported, 13 to go** — slice 3b (2026-09-12) = the boar and the alpha (`EnemyBoar` ai 18, `EnemyWolfAlpha` ai 11 and ai 16 in the ROOM dispatch only; 948 AS3 lines). The boar is the first REACTION override and its three collapse into one: `gotKnockDown` and `gotFly` are ONE LINE each and both call its OWN `gotLaunched`, whose guard INVERTS the base's (a real DOWNED test where the base's is the AS3 precedence bug, and no `canGotLaunched` check at all); its `doLaunched` lands into WALK, never DOWNED; its RUN hits EVERY frame with no range test and no overworld fence. The alpha HOWLS FOR REINFORCEMENTS — `NpcEvent.spawn` and **finding 14**, the seam cannot add an actor mid-fight — and its constructor can emit that spawn BEFORE `init()` runs. Its `gotHit` is not the wolf's: defence inside the alive check and **no `!isDowned()` guard**, so a downed alpha launches again. Two kickoff claims corrected by the source: the `scaleX == 1` trap has NO target anywhere (every `scaleX` use is sign-based), and `setLevel` is NOT the spear boss's copy (15 vs 18 hits, floor `<=0→1` vs `<=3→3`, and the trivial-level branch inverted). +42 tests, 22 plants red first pass; slice 3a (2026-09-12) = the four wanderers (`EnemyBear`/`EnemyDeer`/`EnemyHorse`/`EnemyStag`, 1,148 AS3 lines, none with children; four animals that share a skeleton and agree on almost nothing inside it — only the bear fights and only its `idleCounter` ticks outside IDLE, and it is ticked BEFORE it is checked; only the deer has a behind-the-back flee band and never re-acquires a dead target; only the horse refuses to move without `doChase`; only the stag charges, and its charge does not step down in the overworld where its RUN does. **`EnemyStag`'s constructor takes `doChase` and never assigns it** — ported as it reads, and harmless because the room dispatch has no ai-21 arm at all. The bear must NOT reuse `faceTarget()` (they disagree at exactly equal x). No animal ever loads the roster's elemental columns, so all four defend with permanent zeroes through the base's `gotHit`. +57 tests, **eighteen plants red — two stayed GREEN on the first pass and were re-authored, not argued away**; the measurement was fanned out to 4 read-only agents and adversarially refuted on 2 lenses each, 12/12 returned, the single FATAL refuted the MEASUREMENT not the port; findings 12 = the stag would be telegraphed twice under finding 9's ruling, 13 = `doChase` has no source on the seam side; no seam change at all); slice 2b (2026-09-10) = the archers and the spear elites (`EnemyArcher`→`FriendlyArcher`, `EnemySpearElite`→`FriendlySpearElite`; the first FRIENDLIES, built from the player's live stats at 0.75; the spear BOSS balanced against the player through a floor chain that falls through, pinned; the arrow as an event; +40 tests, seven plants red; findings 10 = the arrow has no seam channel, 11 = a friendly through the seam would target the player); slice 2a (2026-09-10) = the wolves and the civilians, parents with their children (`EnemyWolf`→`EnemyWolf2`/`EnemyFox`, `EnemyCivilian`→`EnemyCivilianFemale`/`EnemyCivilianOld`; the FIRST reception-side overrides, ported as full bodies and pinned six ways against the base; +56 tests, eight plants red; finding 9 = the pounce strikes untelegraphed; the fox's third-party lyric lines stay OUT of the repo); slice 1 (2026-09-09) = the five pattern-setters (`EnemyKatana`/`EnemyKnife`/`EnemySpear`/`RoomGoblin`/`RoomOgre`, +35 tests, six plants red, one plant that stayed green exposed a missing boundary pin, now added); slice 0 — the `NPC.as` base (51 functions), `MCSActor`, `Damage`, four generated symbol tables and the seam adapter (24 Hz stepped inside the 60 Hz tick, `OpponentController.ts` unchanged), +95 tests, six guards chaos-planted; two kickoff numbers corrected by the source (`MCSPlayer extends NPC`; vocabulary 22 over the 34, 31 over the 39). Slices 4–6 open (13 more: goblins and ogre, ninja / shield / zombies, the props, the bosses) — 21 of 34 ported, and there is no slice 4 kickoff yet; the seven things the seam cannot carry are listed in DIVERGENCES "L4b (slice 0)" for L5. Then the fight-feel grade against an A1 cite. `AI_TIERS` is still the hand-authored stand-in and maps to no OG value — rewiring it moves `Sim.ts` and is **L5's** (DIVERGENCES "SESSION 32"). |
| **L5** | **COMBAT CORE** — reach cap, slash-vs-move, crit read, Focus gating, TTK | **Opus · heavy** | SESSION 24 §2 A12-A…F green; duel-baseline re-recorded ONCE, atomically |
| **L6** | **ART + ANIM** — the live `r="1"` z-order defect, then the remaining ~150 animations | **Opus · heavy** for the defect + every LOOK · **Fable · bounded** for bulk transcription | `r="1"` honoured (A3); each anim transcribed + byte-checked + pins extended deliberately; floors ≥ 0.9005 / ≥ 0.8490 / ≤ 140.5 hold |
| **L7** | **AUDIO** — WebAudio synthesis, from scratch | **Fable · bounded** · ⚠ **gate is KHESHAV'S EARS** — no model can hear | characterised via a listen-pass, then A/B'd by the owner; his verdict logged verbatim |
| **L8** | **UI + SCREENS** — aspect-ratio truth (800×480 native), pause/options/dialogue metrics, off-screen screens | **Opus · heavy** | fidelity gate stays 55/55; each screen matches its A1 frame; the 5:3-vs-16:9 pillarbox question answered with evidence |
| **L9** | **WORLD** — room graph, map topology, AP, travel, save schema | **Fable · bounded** | rooms/coords from A2 where held, labelled authored where not; a save round-trips |
| **L10** | **PROGRESSION + ECONOMY** — curves, prices, sell formula | **Fable · bounded** · **Opus** adversarial fit-check | every curve either A2-sourced or labelled INFERRED with its fit shown |
| **L11** | **META + REBIRTH** — clans, War Room, elements; the server sim is gone → authored offline sim | **Fable · bounded** | every authored-not-original piece labelled in DIVERGENCES; nothing presented as OG fidelity that isn't |

**Ordering rule:** L0 first, always. Then **highest (leverage ÷ risk)** — which
after L0 is **~~L2~~ → L3 → L4 → L1**, cheapest-first: their rows are already held and
their gates are byte-checks rather than judgement calls. L5 and L6 interleave
whenever the owner's LOOK queue has an open verdict. L7 waits for his ears.

### §2.1 THE STRING TABLE IS RESOLVED — 2026-08-14, `6ff47f1`

`docs/gauntlet/L0/index/resolved_names.json` resolves every name/desc id:
**itemdata 804 rows / 0 misses · npcdata 484 / 6 · skilldata 73 / 0.** L2 and L3 are
UNBLOCKED and L1b is closed before it ran.

> ⚠ **The caveat that outlives the blocker (C2).** All four data XMLs are the **Android**
> build: the web payload carries zero `<questdata>/<skilldata>/<npcdata>/<itemdata>` roots.
> Every row ported from them is **v0.682** until a web-side artifact says otherwise, and
> that caps achievable 1:1 on L1–L4. Carry this on every generated config header.

Same pass identified the game's font — `<font face="Edo SZ">` in `ui_strings.txt`
(`Calibri` for secondary text) — closing the art-anim "font (unidentified)" blocker.

### §2.2 THE PAPERDOLL IS 13 / 12 / 9 — ALL THREE NUMBERS ARE RIGHT — 2026-09-05, `652eebb`

**Superseded the same day it was written.** The first cut of this section said "12 layers"
and called the `<mcs>` tag order a serialiser artifact. **Both were wrong**, and they were
wrong because this section was written from `npcdata.xml` alone without opening the AS3 —
which `docs/gauntlet/L0/` had already read. Corrected here from the source, first-hand.

**There are three numbers because there are three different things**, and they reconcile
exactly (**9 + 4 = 13**):

| # | What it is | Artifact |
|---:|---|---|
| **13** | the equipment **MODEL** — `EQ_ARMOR 0 · EQ_GLOVES 1 · EQ_HAIR 2 · EQ_HAT 3 · EQ_HEAD 4 · EQ_MASK 5 · EQ_NECK 6 · EQ_PANTS 7 · EQ_SHOES 8 · EQ_WEAPON 9 · EQ_SCABBARD 10 · EQ_ACCESSORY1 11 · EQ_ACCESSORY2 12` | A2 `StatsManager.as:262-286` |
| **12** | what the **RENDERER** takes — `MCSCharacter.initMCS(armor, gloves, hair, hat, head, mask, neck, pants, shoes, weapon, propid, prop2id)` | A2 `MCSCharacter.as:300` |
| **9** | the **EQUIP UI** boxes — the 9 stat-granting slots. `EQ_HAIR`, `EQ_HEAD`, `EQ_NECK`, `EQ_SCABBARD` have no box | A1 `SYNTHESIS.md` §1.3 (A-13) |

- **`prop1` IS the scabbard, not a generic prop** — `XMLNpc.as:398` writes
  `"<prop1>" + equipment[StatsManager.EQ_SCABBARD].getItemID() + "</prop1>"`.
- **The two ring boxes are `EQ_ACCESSORY1`/`EQ_ACCESSORY2`** — equippable, stat-granting,
  and **never drawn**: they are the two model slots the renderer does not receive. Item
  `<type>` **11** (ids 3000–3008: *Ring, Diamond Ring, War Hero Ring, Amulet*, all carrying
  a `<defense>`) has no `<mcs>` tag at all.
- **`<mcs>`'s tag order is the EQ INDEX ORDER, not a serialiser artifact.** `initMCS` builds
  `mcsString = armor|gloves|hair|hat|head|mask|neck|pants|shoes|weapon|prop|prop2`
  (`MCSCharacter.as:349`) and the XML mirrors it field for field. It *looks* alphabetical
  because the developer assigned indices 0–9 alphabetically. **The order is meaningful.**

> ⚠️ **IT IS STILL NOT THE Z-ORDER, and that is the trap.** `initMCS` calls its setters in a
> **different** sequence from the vector order:
> `setHead → setMask → setHatHair → setHair → setHat → setNeck → setArmor → setShoes →
> setPants → setGloves → setWeapon → setProp`.
> That call sequence is **the lead** for L3's compositing half; whether it equals draw depth
> needs the FLA child depths or an A1 frame. **Compositing in `<mcs>` order would be
> confidently wrong, and no test in this repo would catch it.**
> **Veto:** treat either order as z-order without a frame grade.

> ✅ **Corroborates L3's data half from CODE.** `initMCS`'s naked fallbacks name the base
> body art outright — armor **4000**, gloves **5000**, hair **6000/6001**, hat **7000**,
> mask **9000**, neck **10000**, pants **11000**, shoes **12000**, weapon/prop **13000**.
> **8 of those 10 are unnamed rows in `OG_ITEMS`**, carrying only `id` (+`type`, and 4000
> also `defense`/`weight`) — which is why the 178 unnamed items have no desc, no art and no
> modifier: they are the naked paperdoll. ⚠️ **The two hair defaults are the exception:**
> 6000 and 6001 DO carry a `<name>` (the generic *"Hair"*) and a `<desc>`, so "unnamed" is
> not a safe test for "is base art" — the id band is.

> ✅ **741 of the 3,210 `<mcs>` slot values are COMMA-SEPARATED LISTS** (hair 355, weapon
> 176, mask 72, hat 43, armor 39, pants 30, shoes 15, head 11), and `0` means empty. **They
> ARE a per-NPC randomisation pool — SETTLED 2026-09-06 from the source, and this line used
> to say "a hypothesis, not a finding".** `MCSCharacter.as:573-578`:
> `processString(xmlstring) { selectArray = xmlstring.split(","); return
> selectArray[int(Math.random() * selectArray.length)]; }` — a uniform pick, once, at spawn.
> `XMLNpc.as:561` does the same for its generated `hairlist`.
> ⚠️ **Two different randomness sources for the same kind of choice:** `processString` uses
> **`Math.random()`**, `XMLNpc.as:561` uses the **seeded `rng.rand()`**. That matters the
> day a paperdoll has to be reproducible; `src/core/` bans `Math.random` outright.
>
> ⛔ **CORRECTED 2026-09-07 — this line used to say `<mcs>` "also carries per-slot colour
> overrides (`<armorpcolor>`, `<armorscolor>`, …, `XMLNpc.as:367-374`) that L4's transcriber
> must not drop". IT DOES NOT.** `grep -c color reference/extracted/npcdata.xml` → **0**, and
> the file's vocabulary is closed at **32 tag names** with no `*color` among them. Those tags
> are emitted by `XMLNpc.as:367-374` into the XML the game *generates at runtime* for a player
> or procgen NPC — they were never in the payload. There is nothing for L4 to drop, and the
> old wording would have sent a lane hunting for data that does not exist.

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
5. **DECLARE A TERMINATION ARGUMENT.** Every loop states, before it runs, what
   makes it stop — a proof, a budget, or both. "Loop until dry" is not one:
   measured on L0, t2 decays (0.13, 0.37) but **t1 is a fixed point** — every
   overturn-claimer judged spawns ~1.0–1.14 more, so it never goes dry at any
   budget, and it took an owner ruling to stop. Dedup against everything *seen*,
   not everything *confirmed*.
6. **GATE.** Binary. Every item green with pasted output, or the lane is open.
   **Never soften a gate to fit a result** — re-author, or take a ruling.
7. **RE-ARM.** Update `RESUME_HERE.md` + `docs/sessions/-SESSION-LOG.md` +
   `DIVERGENCES.md` **in the same commit as the change they describe**, tick the
   lane in §2, and name the next lane. The engine is not done until it has
   pointed at its own next run.

8. **ONE WORKFLOW IN FLIGHT.** (Owner rule, 2026-08-22.) A stage may fan out to as
   many agents as the lane needs, but **only one workflow runs at a time.** Two reasons,
   and the second is the one that actually forces it:
   - **Serial is NOT safe** — corrected 2026-08-24. Waves 1 and 2 ran together, 19 agents,
     and took wall #9 as a pair, which read as *concurrency causes the wall*. It does not:
     SESSION 27 ran **strictly serially** and still took wall #11 (`0d8aa6d`). Usage is
     total tokens; serialising only spreads the same spend. **Budget the total.**
   - **You cannot rebuild shared state while a run is live.** `buildWorklist.py`
     renumbers the judging packets on every build, and a live run's queued agents have
     not read theirs yet — rebuilding mid-flight hands them a packet nobody assigned
     them, while the findings they were meant to judge stay UNJUDGED, which under §0
     kills them. One run at a time makes bank → rebuild → relaunch always safe. That is
     a **correctness** argument, so it holds even when tokens are free.

   > ⚠ **Do not justify this rule by "we would lose everything."** Since §3.4's agents
   > write their structured output to disk *before* returning, wall #9 killed 9 of 13
   > agents and lost **zero** verdicts from any batch that reached its JSON — two
   > complete 48/48 batches were recovered that the workflow itself reported as lost.
   > The rule is right; catastrophic loss is not the reason any more.

   **The only carve-outs:** a second run that must **review or adversarially check** the
   first, where seeing its finished output would defeat running it blind; or two runs
   over genuinely **disjoint** state where **neither rebuilds a shared index**. Anything
   else waits. When in doubt, serialise and say so.

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

## §5 THE PASTE-READY PROMPT

It lives in `RESUME_HERE.md`, and only there — lane-specific and current. A second copy
here goes stale silently: this one still told the next lead to confirm a baseline of
56 files / 894 tests, which has been wrong since 2026-08-20.
---

## §6 RULINGS MADE FOR YOU — each with a one-line veto

**R1 — ✅ OWNER-CONFIRMED 2026-08-13: verbatim character dialogue is COMMITTED
to `src/`, and public ship is gated.** The repo is **private**, so porting the
3,307 lines into the source tree is development use, not distribution. The
2026-07-24 permission ruling covers Lut's *art* and hues explicitly; this
extends the same attested grant to their *text*. L1 writes the DIVERGENCES entry
+ a ruling amendment as its first commit, and adds a gate that **blocks any
public/ship build until the grant's wording is re-checked for text and for
commercial scope.**

**Scope, since "dialogue" has four meanings in this payload** — the owner
confirmed the first; the rest are decided here on the identical rights logic
(all Lut's text, private repo, development use), flagged so he can narrow it:

| Category | Where | Verbatim? |
|---|---|---|
| **Character dialogue** — 3,307 `<text>` lines + 471 choice options | `questdata.xml` | ✅ **owner-confirmed** |
| **Quest + step titles** — *"Look for a man named Hiroshi"* | `questdata.xml` | ✅ decided — same file, same authorship, reads as story |
| **UI copy** — *"action points"*, War Room rules, betting-odds text | `ui_strings.txt` | ✅ decided — interface text; a paraphrased HUD is not 1:1 |
| **Item + skill names/descriptions** | resolved 2026-08-14 (§2.1) | ✅ decided — same rights logic as the rows they name |

> **Veto (any row):** paraphrase that row into `src/`, keep verbatim in
> gitignored `reference/`. Costs the 1:1 on that surface and makes every line a
> judgement call an agent can drift on.

**R2 — AMENDED 2026-08-24: L0 no longer gates L2/L3/L4.** R2 originally read *"L0 runs
before any other lane"* — to stop lanes being planned off a stale ledger. **That premise
is spent.** L2/L3/L4 are byte-checked transforms that read `reference/extracted/*.xml`
**directly**; they never consult the ledger, so a stale ledger cannot misdirect them. The
cost of the original reading is measured: **27 days, 58 commits, 0 touching `src/`** —
`0719673` (2026-07-28) is still the last change a player could see. L0's remaining work is
the ledger rewrite; it is now **parallel**, not prior.
> **Veto:** restore *"L0 runs before any other lane"* — costs another L0-length lane before
> any code moves, and L0's own gate is markdown integrity, which no player can see.

**R3 — Combat (L5) and the campaign lanes coexist; §4 keeps them apart.**
SESSION 24's A12.2 is mid-flight with an atomic baseline protocol. L1–L4 touch
config and new subsystems, never `Sim.ts` or the baseline, so they can run
without endangering it.
> **Veto:** freeze A12.2 until the campaign lands.

**R4 — L7 (audio) does not start until you can listen.** No model in this repo
can hear; a gate no agent can evaluate is theatre.
> **Veto:** let a lane ship synthesized audio on a written spec alone.

**R5 — ✅ OWNER RULING 2026-08-13: Opus lanes are UNLIMITED, Fable lanes stay
bounded (12–16).** Recorded in §2. But see the §2 script rule: the lanes that
looked agent-hungry (L2/L3/L4 — 982 items, 495 NPCs, 75 skills) are
**deterministic transforms and get a generator script instead**. So the ceiling
binds on far less than it first appeared. **Unlimited is worth spending on
exactly two lanes: L6** (~150 remaining animations, each needing an independent
visual grade) **and L8** (every off-screen UI screen matched to its frame) —
both Opus lanes by routing anyway.

**R6 — THE MODEL FOR THE NEXT SESSION IS OPUS 5 @ `xhigh`.** Not a change to the
standing routing rule — an application of it. The next lane is **L0**, whose
work is *read the evidence and overturn a stale document's conclusions across 12
systems*: judgement-dense, small (~8 agents), and squarely the
"interactive/surgical" category the standing rule already assigns to Opus. Scale
is irrelevant there; being right is everything. After L0 the queue is **L1's
skills port** and **L3's item port** — deterministic transforms, and
subsystem debugging, still Opus-shaped.
**Switch to Fable 5 @ `high` when the queue reaches L7 / L9 / L11** — genuine
from-scratch subsystem construction, its named strength — and its 12–16 cap
costs nothing there, because those lanes are depth-bound, not width-bound.
> **Veto:** run L0 on Fable — it would work, but you would be paying Fable's
> long-horizon strength for a short judgement task and taking a bounded agent
> ceiling you have no use for.

**R7 — THE RATIO RULING (2026-08-24). The axe is sharp. CHOP.**
Measured, not felt: `0719673` (2026-07-28) is the last commit a player could see. Since
then, **58 commits, +326,094 doc lines, 0 lines of `src/`** — a ratio near **100/0**. The
Axe-Sharpening note prescribes 60/40 early and **10/90 late**, and its ROI argument is that
sharpening compounds *across future subjects*; process docs for one dead game do not. **Rule:
10/90 from now, and the 10 is spent only on a rule an incident has already broken.**

**The next chop is L2 — skills — and nothing else until it lands.** `skilldata.xml` holds
**75 skills × 182 rows** with exact `<chi>`/`<cooldown>`, unread for 30 days, while
`src/config/skills.ts` ships **three** skills with **two cooldowns hand-guessed**. It is a
deterministic transform with a byte-check gate — no judgement call, no owner LOOK, no legal
gate — and this repo has already proven the exact shape: `741fd31` promoted **710 nodes to
CONTRACT in ONE commit** with a 159-line script plus a byte-pin test.

**Not L1.** L1's gate is the whole campaign playable end-to-end plus four from-scratch
runtimes, and R1 gates its text on a permission re-check. It is the largest lane on the board.

> ⚠ **What actually froze `src/` was never a rule.** Six workflow scripts carry *"DO NOT
> MODIFY ANY FILE outside your assigned journal path. This lane touches no source code"* —
> correct for a survey lane, and strictly wider than §4's no-touch list, which names two
> files. **Arming L2 requires zero rule edits.** No document was the constraint; the lane
> selection was.
> **Veto:** keep grinding L0 to a closed gate first — costs the ratio another lane, and L0's
> gate is markdown integrity, which no player can see.
