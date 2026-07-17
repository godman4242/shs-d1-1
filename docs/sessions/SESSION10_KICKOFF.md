# SESSION 10 KICKOFF — OWNER VERDICT: control-model correction (mouse-first, command-slash)

> **Supersedes** the knockdown/hit-tint kickoff (git history at `0445773`) —
> the owner feel-run (2026-07-18) returned fundamental control-model
> corrections that outrank all queued motion polish. Entry route:
> `RESUME_HERE.md` → this file. Read
> **`docs/research/fidelity/MOTION_MEASUREMENTS.md`** first (applied numbers
> + pending candidates). Standing rulings:
> `SESSION8_MOTION_KICKOFF.md` §Standing rulings (RECREATE-NEVER-RIP held
> 3×; assertion follows MEASUREMENT; red-first; loop single-writer PAUSE
> dance). The digest (`SHSD_MASTER_REFERENCE.md`) stays useful but Session
> 9 caught it inflating — treat unverified numbers as estimates.

## The owner verdict (feel-run 2026-07-18 — HIGHEST-precedence measurement; he played the OG)

1. **No WASD.** The OG is mouse-only: you move by CLICKING the screen
   (point-and-click). Our A/D keys are an invention.
2. **The drawn line does NOT damage by itself.** It is a TARGETING
   command: the character RUNS toward the drawn line, then SLASHES that
   area — enemies inside the slash area at execution take the damage.
   Today we damage any enemy the line crosses, from any distance, with
   the fighter never closing in. Wrong model.
3. **Damage is far too low.** (Our own research corroborates: PvE trash
   resolves in 3–10 s — SYNTHESIS §6.1 — while our duel needs ~19 hits.)
4. **Crit bar fills too slowly.**
5. **Stances feel like they do nothing.**
6. **AUTO SLASH does nothing** (the plate is render-only — flagged as
   such since M6, now owner-called).
7. **Build step-by-step following the video from the top**: opening
   screen → loading screen → how the character walks → the first enemies
   he meets → how the helper character guides the early beats. The
   longplay's actual sequence becomes the build order.

## What survives vs what falls

- **Falls**: stroke-vs-hitbox damage as the final model (Stage-1 interim
  that overstayed) · WASD as player input (demote to a DEV-seam debug
  fallback or delete) · "dash on every stroke from anywhere".
- **Survives untouched**: the measured lunge itself — `DASH_SLASH_PX`
  127, the 1-frame snap, streak-after-arrival, one-lunge-per-swing-cycle
  (SLASH_FRAMES) — it becomes the FINAL approach step of the corrected
  command; the measured walk/run gaits (stride 72, run ~14 px/f
  bounding) become the travel step. All pose/timing work (15fps latch,
  crouch coil, crumple) unaffected. Purity gates, sim-owns-state,
  red-first discipline, fidelity gate 55/55 — unchanged.
- The Session-9 DIVERGENCES dash block gets a supersession note when the
  code changes (not before).

## Ordered work list

1. **STUDY PASS first — no code until the numbers exist.** From the
   longplays (A = `zFtCaTO0_1M` world build, B = `Nr4fQstqHDM` duels),
   ledger every number (extend MOTION_MEASUREMENTS or open
   `COMBAT_MEASUREMENTS.md`):
   a. Click-to-move anatomy: click → walk or run threshold, arrival
      stop behavior, re-click cadence, any click marker FX.
   b. Command-slash anatomy END-TO-END, one clean capture: draw far from
      a mob → run-in → lunge → slash executes AT the line → popup.
      (Approach ~10 px/f, windup 4f, lunge 1f are already pinned — what
      is missing is the TRIGGER RANGE and the slash-area extent.)
   c. Damage numbers: popup values per swing on early mobs, per stance
      if readable; hits-to-kill for the first-area enemies; HP-bar drop
      fractions. (Popup kinematics already in the ledger.)
   d. Crit-bar fill: on-screen seconds/swings from empty to full.
   e. Stance deltas that are VISIBLE: arc reach/width, swing cadence
      (SLASH_FRAMES pins cadence already), damage delta if popups show it.
   f. AUTO SLASH ON: what changes (likely: attacks auto-fire on
      proximity/click without drawing — MEASURE, don't guess).
   g. Opening-flow shot list for item 5: title screen anatomy, loading
      screen, first walk, first mob encounter beats, helper-character
      tutorial beats — timestamps + frame refs only (build comes later).
2. **Control model in Sim, red-first (the session's code headline):**
   a. Click-to-move: `PlayerIntent` gains a move target (world x);
      Sim walks/runs at the MEASURED speeds with an arrival radius;
      chaos: NaN/off-arena targets clamp. WASD → dev-seam only (veto =
      delete outright). Scene: pointer click on ground sets the target.
   b. Command-slash: a completed stroke becomes a QUEUED COMMAND
      (target = the drawn line's position + geometry), not an instant
      resolution. Sim ticks the approach (run gait) → inside trigger
      range → the Session-9 lunge fires (127 px snap, swing-cycle
      rate-limited) → slash resolves AT ARRIVAL against enemies inside
      the slash area AT THAT MOMENT (an enemy that moved away = whiff).
      Chaos: command canceled by getting hit/death mid-approach; two
      commands queued = latest wins (or measured behavior).
   c. The 24-seed harness bot re-seated on the new verbs (click-move +
      command-slash); determinism fingerprint re-proven cross-process.
3. **Feel numbers from 1c–1e**: re-seed damage/defense/HP/crit-fill in
   config (labels honest: MEASURED where popups were read, INFERRED
   where tuned); stance deltas applied; harness re-banded — trash
   3–10 s, duel band separate (research already flags 20–60 s as
   boss/PvP). Gate: hits-to-kill on the standard mob matches the
   measured count exactly.
4. **AUTO SLASH**: implement the measured behavior (or, if 1f proves it
   out of Stage scope, wire the plate to real state and log the
   deferral). The plate must never lie again.
5. **Video-first campaign flow — SESSION 11+ (scope only this session):**
   using 1g's shot list, order the build: title → loading → world walk →
   first encounter → helper tutorial beats. **Names/dialogue stay
   ORIGINAL (root invariant; our cast keeps our names). OPEN DECISION
   for Kheshav**: he referenced the OG cast by name — if he wants
   near-OG naming (like the palette veto), that is his call to log;
   default = original names, roles/beats recreated exactly.
6. **Close**: ledgers · DIVERGENCES supersession block for the old
   slash model · RESUME_HERE + SESSION11 kickoff, same-commit.

## Gate (binary)

| # | Item | Verify |
|---|---|---|
| 1 | Study ledger rows exist for 1a–1g (numbers + frame refs) | ledger diff |
| 2 | Click ground → character walks/runs there and STOPS (±10 px), measured speeds | browser evidence + sim reads |
| 3 | Draw line at range → run-in → lunge → slash resolves AT the line; far-away line-over-enemy WITHOUT approach deals NO damage | red-first test names + browser capture |
| 4 | Hits-to-kill on the standard mob == measured count; crit fill == measured time | test pins + browser |
| 5 | Stance switch produces a visible, measured delta | capture pair |
| 6 | AUTO SLASH state is real (measured behavior or honest disable) | browser toggle evidence |
| 7 | Suite · tsc ×2 · eslint · fidelity 55/55 · zero fresh-load console errors · harness re-banded green | pastes |
| 8 | Ledgers + RESUME_HERE + SESSION11 kickoff in closing commit | `git show --stat` |
