# SESSION 9 KICKOFF — dash-through slash + crouch depth (motion, part 3)

> Entry route: `RESUME_HERE.md` → this file. Read
> **`docs/research/fidelity/MOTION_MEASUREMENTS.md`** FIRST — it now
> carries every applied number AND the measured-not-applied candidates
> this session works from. Never re-measure what it pins; never trust
> memory over it. Navigable digest of all research:
> `docs/research/SHSD_MASTER_REFERENCE.md` (header pins precedence).
> Standing rulings: `SESSION8_MOTION_KICKOFF.md` §Standing rulings
> (RECREATE-NEVER-RIP held 3×; measurement-over-render; red-first;
> loop single-writer PAUSE dance).

## Bar self-report (Session 8B close, honest)

- Item 1 (SLASH_FRAMES measured, both fighters) — **GREEN**: intervals
  12/16/20 pinned (f435439), corroborated by strike-B's 5-attack log;
  8f windup holds proved special-move-only (jump-slash/finisher),
  basic windup stays 4f — ledgered, config untouched.
- Item 2 (WALK amplitudes tightened) — **GREEN**: bob 3→1 (0.9%h
  detrended), armSwing 7→0 (weapon-locked, 3 viewers + eyeball),
  IDLE_BREATH halved (≤0.5%h). footSwing/footLift stay MEASURED-coarse
  (hakama occlusion) — close-up plant reads remain discretionary.
- Item 3 (proportions + composite) — **GREEN with a flag**: semi-crouch
  IDLE_POSE applied red-first; composite delivered
  (`<784a688d scratchpad>/idle-composite-8b.png`); honest verdict **B+ —
  the OG crouch reads DEEPER than ours** (front knee further forward,
  more torso coil). Deepening is Session 9 item 3.
- Item 4 (owner feel-run) — **OPEN, queued** (walk strides + kill
  collapse + blind A/B vs the OG clip). Nothing blocks it.
- Item 5 (gate pastes) — suite 444/444 · tsc ×2 exit 0 · eslint exit 0
  pasted at each commit; fidelity 55/55 re-proven in-browser after the
  pose change AND after the amplitude change (close-out run), zero
  fresh-load console errors both times.
- Item 6 (ledgers + kickoff same-commit) — this commit.
- Viewer accounting (honest): 4 of 9 returned (approach, strikes A/B/C);
  the 5 capped viewers' items were salvaged inline the same night (CSV
  windowed analysis + direct frame reads). Death-fall ASSUMPTION is now
  CONFIRMED. Remaining viewer value is discretionary (resume line in the
  ledger's PENDING block).

## Ordered work list

1. **Owner feel-run** (human eyes, first 5 min): `npm run dev` → hold
   A/D — strides at the 15fps latch, arms weapon-locked, subtle bob;
   win a duel — collapse reads as a crumple; then the blind A/B against
   the OG clip. Record the verdict line in the session log.
2. **HEADLINE — dash-through slash** (the OG's signature move, our
   biggest measured motion gap): the attacker's translation completes in
   **ONE video frame** (~235–240 px @1080 ≈ ~125 stage px), landing pose
   holds 4–12f, the red streak renders AFTER arrival (ledger
   "measured-not-applied" block, strike-C evidence). Our player never
   translates on a slash. This is SIM territory (position = gameplay):
   design the rule first (dash along the drawn stroke? clamp to arena?
   pass-through vs stop-at-target?), then red-first Sim tests, then the
   render snap (no easing — it's a teleport). DIVERGENCES entry for
   whatever bounds we choose. Chaos-test the arena clamp.
3. **Deepen the combat crouch** (composite verdict B+): push kneeF/pelvis
   toward the OG's deeper coil WITHIN the measured ratios (knee-bend
   ~157°, height ~117 stage px are hard pins — depth comes from joint
   x-offsets, not height). Re-render the composite, re-verdict honestly.
   Gate 55/55 must stay green (fighter-adjacent probes).
4. **Discretionary viewers** (only if quota is idle): strike-D extra
   swings · 30fps locomotion-latch check (poseStepMs stays 15fps until
   this is re-measured) · close-up foot plants. Resume line in the
   ledger.
5. **Close**: ledger rows moved to applied · TELLS/CALIBRATION rows for
   the dash-through · RESUME_HERE + SESSION10 kickoff, same-commit.

## Gate (binary)

| # | Item | Verify |
|---|---|---|
| 1 | Owner feel-run verdict recorded | log line |
| 2 | Dash-through slash in Sim, red-first + chaos-proven clamp | test names + RED receipts in log |
| 3 | Dash render = 1-frame snap, streak after arrival | browser zoom pair + gate 55/55 |
| 4 | Crouch deepened, composite re-delivered + verdict | scratchpad path in log |
| 5 | Suite · tsc ×2 · eslint · 55/55 · zero fresh-load console errors | pastes |
| 6 | Ledgers + RESUME_HERE + SESSION10 kickoff in closing commit | `git show --stat` |
