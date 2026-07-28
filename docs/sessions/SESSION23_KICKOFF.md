# SESSION 23 KICKOFF — GAP TRIAGE DONE. PUT THE FIGHTER IN THE GAME, THEN MAKE HIM MOVE.

> **Entry route:** `RESUME_HERE.md` → this file. **Self-contained; assumes no
> memory of SESSION 22.**
>
> **INTENT, in one sentence:** the art-grammar arc is CLOSED (all seven
> garments + the branch, owner-ruled 2026-07-28) — now close the two highest-
> leverage gaps in the committed gap ledger: the game still doesn't DRAW the
> composed fighter, and the fighter has ONE pose of 158 recorded animations.
>
> **⛔ THE STANDING INVARIANT:** the two gameplay videos are the primary 1:1
> reference (`reference/videos/`). **Open a frame and look** before grading any
> visual claim; when a measurement doc and a frame disagree, **the frame wins.**
>
> **Other standing rulings:** RECREATE-NEVER-RIP for dialogue and names ·
> Duels-not-SHS · single-player-first · `core/` zero numeric literals ·
> render-only scenes · red-first TDD · chaos-plant every guard ·
> **binary gates, never softened to fit a result**.

---

## §0 THE GAP TRIAGE (owner asked 2026-07-28: "look for what we are lacking")

Done from the COMMITTED ledgers — no new research was run and none is needed
to start: `docs/research/REBUILD_READINESS.md` (12 systems scored, avg ~42/100,
§5 ranks close-paths by leverage) + `docs/research/MECHANICS_GAP*` + the
SESSION 21 §7 queue. The triage, decided:

| Priority | Gap | Why it wins | Type |
|---|---|---|---|
| **P1 (this session)** | **DuelScene still calls `drawSamurai`** — three sessions of fighter work the game never draws | biggest visible payoff; fully staged; zero research needed | build |
| **P2 (this session)** | **1 of 158 animations** — idle frame 0 only, transcribed from `reference/extracted/bindata/108_1t4635s0.bin` which holds ALL of them | the data is IN THE REPO — transcription + playback, not research; unlocks walk/attack/hit/death | build |
| **P3 (next, schedule only)** | **All audio** (ledger: "the research session most worth running") | needs a dedicated research pass (WebAudio synthesis params vs the videos' SFX) | research — DO NOT start it mid-session |
| **P4 (next, schedule only)** | Combat-core unknowns (reach cap px, crit final read, Focus gating) per MECHANICS_GAP | Stage-2 numbers; needs frame-counting passes | research |
| **P5 (backlog)** | Second outfit, mob AI cadence (S14 A5/A6), quests/economy/meta systems | later stages own them | build/research |

**Owner-open items carried, NOT decided here:** the kasa height trade
(SESSION 21 §P6) · "will change the gi later, in another session" (his ruling
note — the gi is LANDED and green; any change is a fresh owner ask).

---

## §P PREREQUISITES — ✅ ALL RESOLVED, NOTHING TO GO AND FIND

**P1 — ✅ SESSION 22 IS FULLY CLOSED.** All seven garments re-authored in the
OG grammar (GATE A9-A..E), branch on screen at the measured facing (A9-F).
Floors: tracing ≥ 0.9005 (measured 0.900547) · **held-out ≥ 0.8490** (re-based
DOWN once, by the owner's ruling, cited in `tests/a6Score.test.ts` — from here
UP only) · height ≤ 140.5 (140.48). Suite 52 files / 855 green · fidelity
55/55 · clean clone green.

**P2 — ✅ THE DUELSCENE SWAP IS STAGED.** `grep -rn "drawSamurai" src/game/`
shows the target; `composePose`/`planPose` (core) + `poseScene.ts`'s
injectable pipeline + `OG_DRESSED_NODES`/`OG_EQUIPMENT` (config) are the
pieces. Render-only rule: `Sim` owns state; `duel-baseline` green AND
unedited is the behaviour guard.

**P3 — ✅ THE ANIMATION DATA IS DECODED, ONE FRAME PROVEN.** The bindata XML
holds all 158 animations; SESSION 18 transcribed idle frame 0 and byte-checked
it (19/19). The playback model is known: per-frame nodes, z-order = creation
order, aliases 8←14 / 17←16, 15 fps latch (measured, SESSION 11). What A11
adds: a transcriber script (bindata → committed frames, byte-checked like the
pose), a pure `core/` frame-stepper, and the scene reading it — the same
discipline as `OG_IDLE_NODES`, per animation.

**P4 — ⚠️ MIRRORING (fighter faces both ways) interacts with `OG_EQUIPMENT`:**
the branch's facing override was proven to be a horizontal mirror (rotation
AND x sign, `142 = 180 − 38`, SESSION 22 A9.6) — a mirrored fighter flips it
back toward the recorded values. Write the compose test before the code.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — DUELSCENE FIRST, ANIMATIONS SECOND
The swap is smaller, fully staged, and the animation work renders INTO it.
> **Veto:** animations first — recommended against; they'd land in a debug route.

### D2 — THE DUEL FIGHTER IS THE DRESSED ONE (gi, hakama, kasa, branch)
The starting loadout every video shows. > **Veto:** bare — the videos never show one.

### D3 — MIRRORING IS A COMPOSE-TIME TRANSFORM, NOT SECOND ART
One shape set, one pose table, a mirror flag in core. > **Veto:** none.

### D4 — ANIMATIONS LAND DATA-FIRST: transcribe → byte-check → step → draw
Exactly the pose pipeline's own discipline, per animation, starting with
walk + one attack (the two the duel loop needs first).
> **Veto:** hand-keyed animation — banned; the recorded data exists.

---

## §2 THE BAR — binary, measurable, fixed before any code exists

| | Test | **THE NUMBER** | Measure |
|---|---|---|---|
| **A11-A** | the game draws the OG fighter | `grep -c drawSamurai src/game/DuelScene.ts` → **0**; composePose in the duel render path | grep + a render test |
| **A11-B** | both combatants, mirrored | 2 fighters, one mirrored, branch facing correct BOTH ways | compose test + a LOOK |
| **A11-C** | behaviour unchanged | `duel-baseline` green AND **unedited**; `Sim` untouched | `git diff` |
| **A11-D** | animation data is CONTRACT | ≥2 animations (walk + one attack) transcribed, **byte-checked against the bindata** like the idle pose was | the skipIf-gated byte suite |
| **A11-E** | the fighter MOVES | a pure `core/` stepper drives the frames at the measured 15 fps latch; scene renders it; determinism suite green | new tests + the existing determinism gates |
| **A11-F** | nothing regressed | floors ≥ 0.9005 / 0.8490 / ≤140.5 · fidelity 55/55 · suite ≥ 855 · clean clone · ratchet not widened | the existing gates |

### ⛔ NOT-DONE — the cut line
Out of scope, deliberately: audio (P3 — its OWN research session) · combat-core
number hunts (P4) · the other ~156 animations · second outfit · mob AI · the
kasa height trade (owner's, still open). **A session that ships those instead
of §2 has not done §2.**

---

## §3 WHAT WILL FIGHT YOU

1. **The golden digests move with every render change** — update in the SAME
   commit, say why. Floors move ONLY up (the one sanctioned down-move is spent).
2. **The mirror will try to double the art** (D3 forbids it) and will try to
   flip the equipment override twice (P4 — test first).
3. **`poseRaster.ts` is the only file a test cannot reach.** Keep it so — the
   DuelScene swap goes through the injectable `poseScene`/`composePose` path.
4. **The fidelity gate exceeds the 45 s CDP timeout** — fire-and-poll
   (`window.__fidelityDone`, memory `reference-browser-gate-polling`).
5. **A green gate is not a good picture** — LOOK at the duel, both fighters,
   moving. SESSION 20's bare-torso lesson is standing.
6. **15 fps latch ≠ 60 Hz sim** — the stepper quantises RENDER frames; `Sim`
   stays fixed-60 and untouched (A11-C).

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

- **A11.0** — baseline: `git log --oneline -1` + `npm test` → 52 files / 855
  (wrap commits may sit above; `git diff <kickoff-commit>..HEAD -- src tests`
  must be empty or explained).
- **A11.1** — DuelScene draws the composed dressed fighter (A11-A, A11-C).
- **A11.2** — second combatant + mirroring (A11-B).
- **A11.3** — the animation transcriber + walk & attack, byte-checked (A11-D).
- **A11.4** — the core stepper + scene playback at the 15 fps latch (A11-E).
- **A11.5** — re-grade, gates, handoff, SESSION 24 kickoff (schedule P3 audio
  research as its own next session in it).

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline confirmed, deviation explained | `git log` + `npm test` |
| 2 | `drawSamurai` gone; composePose in the duel path | grep pasted |
| 3 | Both combatants, mirrored, branch correct both ways | test + screenshot |
| 4 | duel-baseline green AND unedited; Sim untouched | `git diff` |
| 5 | ≥2 animations transcribed, byte-checked | the skipIf suite pasted |
| 6 | The fighter moves at the measured latch; determinism green | tests pasted |
| 7 | Floors ≥ 0.9005 / 0.8490 / ≤140.5; fidelity 55/55; clean clone | pasted |
| 8 | Ledgers + RESUME in the same commit as their change | `git show --stat` |
| 9 | A human looked at the MOVING duel and said what closed | verdict in commit |
| 10 | SESSION 24 kickoff written, committed, graded (P3 audio scheduled) | the file |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the swap quietly changes gameplay feel.** duel-baseline unedited +
Sim untouched is the guard; if a timing or hitbox number moves to "make the
art fit", that is the bug.

**Risk 2 — animation transcription drifts from the bindata.** The byte-check
IS the gate (A11-D), exactly as `OG_IDLE_NODES` earned trust; hand-fixed
frames are banned.

---

## §7 BAR SELF-REPORT

**Does this kickoff reach the bar? ✅ Yes — the next change would be churn.**

- The owner's ask ("find what we're lacking, evaluate, high-priority first")
  is EXECUTED, not deferred: the triage table is decided from committed
  ledgers, research is scheduled-not-started, and the two build-ready gaps
  with the highest leverage are the session.
- Every goal has a runnable measure that can fail; the cut line is explicit.
- It carries SESSION 22's floor discipline forward spent-and-closed: the one
  sanctioned down-move is cited in-file; from here floors move up only.
- **What it deliberately does not promise:** audio, combat numbers, the other
  156 animations — each named with its owner (P3/P4/P5) instead of dropped.
