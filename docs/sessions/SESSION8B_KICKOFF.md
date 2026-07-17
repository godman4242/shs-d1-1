# SESSION 8B KICKOFF — finish the motion slice (continuation of Session 8)

> Entry route: `RESUME_HERE.md` → this file. Slice 1+2 are COMMITTED
> (distance-driven stride, 15fps pose latch, measured walk/hit/death
> numbers, gate 55/55 re-proven — see the session log 2026-07-17).
> Measurement truth lives in
> **`docs/research/fidelity/MOTION_MEASUREMENTS.md`** — read it FIRST;
> never re-measure what it already pins, never trust memory over it.
> Standing rulings: `SESSION8_MOTION_KICKOFF.md` §Standing rulings
> (RECREATE-NEVER-RIP held 3×; measurement-over-render; red-first; loop
> single-writer PAUSE dance).

## Bar self-report (Session 8 close, honest)

- Gate items 1 (measured config, no time-driven stride), 2 (legs stride,
  no skating — unit-pinned + browser zooms), 5 (55/55 + suite + tsc +
  eslint + zero console errors) — **GREEN, evidence in the log**.
- Item 3 (strike arcs at measured frame counts on BOTH fighters) —
  **PARTIAL**: one exchange measured frame-exact (duel-strike-A); the
  animator still runs the old INFERRED `SLASH_FRAMES`. 9 viewer agents
  died on the session limit (resets 4:50am +08 2026-07-18).
- Item 4 (hit recoil + death collapse) — recoil + deathMs MEASURED and
  applied; the live collapse eyeball is QUEUED for the owner (unit-pinned;
  333ms outruns MCP screenshot round-trips).
- Item 6 (proportions + composite) — NOT STARTED (semi-crouch combat idle
  + ~220px sprite height measured and ledgered, unapplied).
- Item 7 (ledgers + kickoff) — this file + ledger + RESUME_HERE, same
  commit.

## Ordered work list

1. **Resume the measurement workflow** (after the limit reset):
   `Workflow({scriptPath: '<session>/workflows/scripts/motion-measure-wf_087914b1-a51.js', resumeFromRunId: 'wf_087914b1-a51'})`
   — duel-strike-A replays from cache; 9 viewers re-run. If the scratchpad
   frame corpus is gone, re-extract per the ledger's manifest note (fix:
   walk windows are 464–468 / 490–497, NOT the kickoff's 397/425).
2. **Apply what the viewers return** (red-first, double-entry):
   `SLASH_FRAMES` per-stance windup/active/recovery at 15fps anim steps ·
   WALK amplitude tightening (arm counter-swing arc, bob, lean) ·
   death-fall confirmation (player fall = enemy crumple assumption).
3. **Proportions pass** (fidelity-v2 slice 3, same files): semi-crouch
   combat IDLE_POSE (measured: knees bent, wide base, blade low-forward),
   sprite ratios off the ledger (~220px @1080 standing, kasa width,
   torso/leg split, blade length) → `config/poses.ts` + `game/samurai.ts`
   (ORIGINAL linework, measured ratios only). Deliverable: side-by-side
   composite in the scratchpad + honest verdict line in the log.
   Gate 55/55 must stay green after (fighter-adjacent probes exist).
4. **Owner feel-run** (human eyes, queued): walk A/D — strides read at the
   OG's 15fps step; kill collapse; then the blind A/B against the OG clip.
5. **Close**: DIVERGENCES entry for any measured correction · TELLS rows
   6/20 · RESUME_HERE + SESSION9 kickoff same-commit.

## Gate (binary)

| # | Item | Verify |
|---|---|---|
| 1 | SLASH_FRAMES measured (15fps steps) on both fighters | config diff + double-entry green + browser |
| 2 | WALK amplitudes tightened from jog/approach viewers | ledger rows move to "applied" |
| 3 | Proportions applied; composite + verdict delivered | scratchpad path in log |
| 4 | Owner feel-run verdict recorded | log line |
| 5 | 55/55 · suite · tsc ×2 · eslint · zero fresh-load console errors | pastes |
| 6 | Ledgers + RESUME_HERE + SESSION9 kickoff in the closing commit | `git show --stat` |
