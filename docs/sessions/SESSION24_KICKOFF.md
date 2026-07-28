# SESSION 24 KICKOFF — MEASURE THE COMBAT, THEN MAKE IT FEEL RIGHT. THE OWNER'S OWN THREE VERDICTS ARE THE SESSION.

> **Entry route:** `RESUME_HERE.md` → this file. **Self-contained; assumes no
> memory of SESSION 23.**
>
> **INTENT, in one sentence:** SESSION 23 put the real fighter in the duel and
> made him move (A11.1–A11.4, owner-looked); now close the gaps the owner SAW —
> strokes of any length land, a point-blank stroke runs instead of slashing,
> and the gait/impact animations are missing — by MEASURING the OG first and
> only then touching gameplay.
>
> **⛔ THE STANDING INVARIANT:** the two gameplay videos are the primary 1:1
> reference (`reference/videos/`). **Open a frame and look** before grading any
> visual claim; when a measurement doc and a frame disagree, **the frame wins.**
>
> **Other standing rulings:** core/ zero numeric literals · render-only scenes ·
> red-first TDD · chaos-plant every guard · animations TRANSCRIBED and
> byte-checked, never hand-keyed · binary gates, never softened to fit a result.

---

## §0 TRIAGE UPDATE (owner LOOK verdicts, 2026-07-28 — they outrank the old order)

| Priority | Gap | Why it wins | Type |
|---|---|---|---|
| **P1 (this session)** | **Uncapped stroke length + point-blank strokes classifying as movement** — the owner hits both in EVERY duel | his own verdicts; both are the old P4 "combat-core unknowns" with faces now | research → build |
| **P2 (this session)** | **Gait + impact animations** — run gait for hold-run travel, hit-stagger, death (the loser currently freezes) | the transcriber makes each cheap; the duel loop reads unfinished without them | build |
| **P3 (SESSION 25, schedule only)** | **All audio** (ledger: "the research session most worth running") | WebAudio synthesis params vs the videos' SFX — its own session, DO NOT start mid-session | research |
| **P4 (backlog)** | Crit final read, Focus gating, second outfit, mob AI, quests/meta | later stages own them | mixed |

**Owner-open items carried, NOT decided here:** the kasa height trade
(SESSION 21 §P6) · "will change the gi later" (his ruling note) · partb's loop
hold during the strike (A11.4 plays ONE cycle; the measured travel duration
belongs to THIS session's frame-counting).

---

## §P PREREQUISITES — ✅ ALL IN THE REPO

**P1 — ✅ SESSION 23 CLOSED A11.1–A11.4.** Both combatants composed + mirrored,
walk + balanced slash transcribed (710 nodes CONTRACT), pure 15 fps stepper,
distance-driven stride (`strideMs`, `WALK.stridePx` 72 MEASURED). Suite
57 files / 894 · fidelity 55/55 **autonomous** (`?fidelity=auto` in a Brave
window — the extension lives in BRAVE, not Chrome) · floors tracing ≥ 0.9005 /
held-out ≥ 0.8490 (spent, UP only) / height ≤ 140.5.

**P2 — ✅ THE MEASUREMENT CORPUS EXISTS.** ~700 stills under
`reference/frames/`, both 1080p longplays, the Session 8 motion corpus, and
`docs/research/MECHANICS_GAP*` naming the unknowns. Strike sequences to count
frames over: B-23 duel window (t≈3771–3790) + A-00 combat frames; more
segments indexed in `docs/research/video-study/segments/`.

**P3 — ✅ THE TRANSCRIBER IS ONE LIST AWAY.** `scripts/anim/transcribeAnims.py`
takes new names in its `ANIMS` list and regenerates `src/config/ogAnims.ts`;
the byte suite (`tests/a11AnimData.test.ts`) pins EXACT anim keys and counts —
extending the list means extending those pins in the same commit, deliberately.
Candidates in the bindata: `run_sheathed` (9f, loop) · `death` (38f) ·
`deathenemy` (23f) · hit-stagger (find the name — grep the bindata; if the OG
has no dedicated hit clip, the video pass must say what it DOES show).

**P4 — ⚠️ GAMEPLAY WILL MOVE THIS SESSION, BY DESIGN.** Stroke cap + gesture
classification live in the Sim. `tests/duel-baseline.test.ts`'s own header
states the protocol: a deliberate, documented model change writes the
DIVERGENCES entry FIRST, then re-records the baseline ONCE in the same commit.
Anything else that moves it is a bug.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — MEASURE BEFORE TOUCHING THE SIM
Both gameplay changes (cap, classification) enter as MEASURED values with
frame cites, or they do not enter. > **Veto:** tune by feel — recommended
against; feel-tuning is how INFERRED drift accumulates.

### D2 — THE BASELINE RE-RECORD IS ONE COMMIT, ONCE
DIVERGENCES entry → sim change → re-record → new baseline, atomically. Two
re-records in one session means the first measurement was wrong — stop and
re-measure. > **Veto:** none.

### D3 — GAIT: RUN FOR HOLD-RUN TRAVEL, WALK RESERVED
The duel's mouse-hold travel is fast; transcribe `run_sheathed` and pick gait
by a MEASURED speed threshold (the walk/run boundary is visible in the videos).
> **Veto:** keep walk-only — the owner already called the current look wrong.

### D4 — DEATH LANDS THIS SESSION
The loser freezing mid-pose is the most visible remaining lie in the duel;
`death` (38f) + the kill-beat slow-mo is the payoff shot. > **Veto:** defer to
P5 — argue only if the session runs long.

---

## §2 THE BAR — binary, measurable, fixed before any code exists

| | Test | **THE NUMBER** | Measure |
|---|---|---|---|
| **A12-A** | stroke reach cap MEASURED | cap in px @1080 + world px, from ≥3 distinct strike sequences, frame-cited | the measurement doc |
| **A12-B** | close-range stroke = SLASH | the OG's slash-vs-move rule measured (length/speed/shape); a point-blank short stroke attacks | doc + a LOOK |
| **A12-C** | the Sim implements A+B | values CONTRACT with cites; DIVERGENCES first; duel-baseline re-recorded ONCE, same commit | `git log` shows the atomic commit |
| **A12-D** | the gait is right | `run_sheathed` transcribed + byte-checked; gait picked by a measured threshold; no foot-skating at ANY speed | byte suite + a LOOK |
| **A12-E** | impacts land | hit reaction (as the video shows it) + `death` transcribed + byte-checked + playing on their events | byte suite + a LOOK at a full kill |
| **A12-F** | nothing regressed | suite ≥ 894 (minus deliberate baseline rows) · fidelity 55/55 · floors ≥ 0.9005/0.8490/≤140.5 · clean clone | the existing gates |

### ⛔ NOT-DONE — the cut line
Audio (SESSION 25, scheduled) · crit/Focus internals · the other ~150
animations · mob AI · quests/meta. **A session that ships those instead of §2
has not done §2.**

---

## §3 WHAT WILL FIGHT YOU

1. **The baseline re-record temptation** — every sim tweak "just needs one more
   re-record". D2 forbids it: one, atomic, documented.
2. **15 fps sampling floor** (SESSION 11): frame-counted durations carry ±1
   frame; state tolerances honestly in the doc.
3. **The anim-key pins are EXACT** (`a11AnimData` structural suite) — adding
   animations means editing the pins in the same commit, deliberately.
4. **Hit-stagger may not exist as a clip** — the bindata grep may find nothing;
   then the videos decide what the OG actually shows on hit (maybe recoil only,
   maybe a frame of the slash chain). Transcribe what IS, never invent.
5. **The fidelity gate needs a VISIBLE window** — `?fidelity=auto` in a fresh
   Brave window (`open -na "Brave Browser" --args --new-window <url>`), verdict
   from any same-origin tab's localStorage; hidden tabs freeze rAF.
6. **A green gate is not a good picture** — the owner looks at the moving duel
   before the session closes, and his verdicts go in the log verbatim.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

- **A12.0** — baseline: `git log --oneline -1` + `npm test` → 57 files / 894.
- **A12.1** — the measurement pass (A12-A + A12-B + D3's speed threshold +
  partb's strike-travel duration): frame-counting over ≥3 sequences each,
  written to `docs/research/fidelity/COMBAT_MEASUREMENTS.md` with cites.
- **A12.2** — Sim: stroke cap + classification from A12.1 (A12-C, atomic
  baseline protocol).
- **A12.3** — transcribe `run_sheathed` + death + the hit answer; extend the
  byte pins (A12-D data half, A12-E data half).
- **A12.4** — gait picker + impact playback in DuelScene (render-only).
- **A12.5** — re-grade, gates, owner LOOK, handoff, SESSION 25 kickoff
  (audio research, its own session).

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline confirmed | `git log` + `npm test` pasted |
| 2 | Reach cap + slash rule measured, ≥3 sequences each, cited | the doc |
| 3 | Sim change atomic: DIVERGENCES → change → ONE re-record | `git show` |
| 4 | Point-blank stroke attacks; strokes cap at the measured length | a LOOK |
| 5 | run/death/hit transcribed, byte-checked, pins extended deliberately | the skipIf suite pasted |
| 6 | No foot-skating at any speed; the loser dies on screen | a LOOK at a kill |
| 7 | Floors ≥ 0.9005/0.8490/≤140.5 · fidelity 55/55 · clean clone | pasted |
| 8 | Ledgers + RESUME in the same commit as their change | `git show --stat` |
| 9 | Owner looked at the moving duel; verdicts logged verbatim | the log |
| 10 | SESSION 25 kickoff written, committed, graded (audio scheduled) | the file |

---

## §6 THE TWO REAL RISKS

**Risk 1 — feel-tuning disguised as measurement.** If a measured value "looks
wrong" in play, the answer is more sequences measured, never a nudged number.
The measurement doc's cites are the audit trail.

**Risk 2 — the atomic re-record leaks.** A second baseline edit in the session
means the measurement was wrong; D2 says stop, revert, re-measure — the
baseline is evidence, not a knob.

---

## §7 BAR SELF-REPORT

**Does this kickoff reach the bar? ✅ Yes — the next change would be churn.**

- The owner's three LOOK verdicts are the session, by name, each with a
  measurable gate (A12-A/B/C for two of them, A12-D/E for the gait/impact gap).
- Gameplay moves only behind measured values and the baseline's own documented
  atomic protocol; the one sanctioned re-record is scoped before any code.
- Audio is scheduled (SESSION 25), not dropped; the cut line is explicit.
- **What it deliberately does not promise:** audio, crit/Focus internals, the
  other ~150 animations — each named with its owner instead of silently absent.
