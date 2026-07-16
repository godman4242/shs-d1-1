# SESSION 8 KICKOFF — MOTION: make the fighters move like the original

> Entry route: `RESUME_HERE.md` → this file. Read
> `docs/research/fidelity/FIDELITY_GATE.md` (measurement protocol) and
> `git log --oneline -5` before any code. Loop cycles route here via
> `docs/loop/GOAL.md`.
>
> **Owner feedback driving this session (2026-07-16):** "it does not look
> like the og game at all, the legs do not move, it feels like a moving
> sprite, only the arms move, even then only in one direction." That feel
> report is the ground truth this session must fix.
>
> **Project framing (owner, 2026-07-16):** this repo is an EXPERIMENT —
> how far Fable 5 can push toward indistinguishable-in-motion — not a
> shipped game (that comes later). The metric is the measured ceiling.

## Standing rulings (do NOT relitigate; flag, don't fold)

1. **RECREATE, NEVER RIP.** The pixel-by-pixel-copy ask was held THREE
   times (2026-07-16, incl. the "only an experiment" framing) — see
   `FIDELITY_V2_KICKOFF.md` Standing Rulings §1. Motion TIMING, amplitudes,
   proportions, colors: measure exactly. Drawings/dialogue: original, always.
2. **Assertion follows MEASUREMENT, never the render.** Re-measure instead
   of widening tolerances (v1 olive-band precedent).
3. **Red-first** applies to probes AND unit tests; chaos-test guards.
4. **Layout truth = the v0.717 longplays**; B (VS-duel build) beats A
   (world build) wherever a duel visual differs.
5. **Loop single-writer:** `scripts/build-loop.sh` may be running between
   sessions. Interactive sessions `touch docs/loop/PAUSE` FIRST and wait
   for `docs/loop/CYCLE_RUNNING` to disappear before editing anything.

## Where things stand (verified at Session-7 close, 2026-07-16)

- Fidelity gate **55/55** (41 points + 14 edge scans, 5 states; `b7d9bf0`)
  · suite 440/440 · tsc/eslint clean · zero console errors.
- **M0 is HALF-landed** — that's the sliding-sprite bug: `core/skeleton.ts`,
  `core/fighterAnimator.ts`, `config/poses.ts` (15 joints), `config/anim.ts`
  (WALK amplitudes) all exist, and DuelScene renders animator poses — but
  **nothing feeds locomotion into the animator**, so fighters glide in one
  pose. Strike/recoil/death arcs aren't driven either. WALK numbers are
  INFERRED guesses, not measured.
- No storyline yet — Stage-4 M1+ (ORIGINAL script over the OG's structural
  skeleton), AFTER motion. Not this session.
- Reference on disk (gitignored, study-only): both 1080p60 longplays in
  `reference/videos/` (A = zFtCaTO0_1M, B = Nr4fQstqHDM).

## Ordered work list

### 1. Motion corpus (~30 min; headless-OK)

Dense extracts into the session scratchpad (STUDY-ONLY, never committed):

```bash
cd reference/videos
S=<scratchpad>/motion
mkdir -p $S/{walk-b05a,walk-b05b,duel-move,death,jog-a28}
# B-05 overworld walking (doc: continuous travel t=06:35–08:29; FIGHT
# splashes at 06:50 and 08:19 — pick clean walk windows between them):
ffmpeg -ss 397.0 -to 400.0 -i Nr4fQstqHDM.mp4 -vf fps=60 $S/walk-b05a/%03d.png
ffmpeg -ss 425.0 -to 428.0 -i Nr4fQstqHDM.mp4 -vf fps=60 $S/walk-b05b/%03d.png
# B-23 in-duel movement (combat live from t≈3773.9; strike arcs + dashes):
ffmpeg -ss 3774.0 -to 3780.0 -i Nr4fQstqHDM.mp4 -vf fps=60 $S/duel-move/%03d.png
# A-22 death collapse (silhouette fall ~t=3360–3362):
ffmpeg -ss 3358.0 -to 3363.0 -i zFtCaTO0_1M.mp4 -vf fps=60 $S/death/%03d.png
# A-28 overworld jog cross-check (doc: auto-run jog ~1:04:12–1:04:58):
ffmpeg -ss 3852.0 -to 3856.0 -i zFtCaTO0_1M.mp4 -vf fps=60 $S/jog-a28/%03d.png
```

If a window lands on a transition/fight, slide it (the segment docs
`B-05-…`, `A-28-…`, `A-22-…` carry the beat-by-beat timestamps). Verify a
frame from each dir VISUALLY before measuring (wrong-window measurements
poisoned nothing yet — keep it that way).

### 2. Measure the walk cycle (headless-OK)

Python/PIL over the extracts (median across ≥3 full strides, ≥2 windows):
stride period in frames (foot-plant to same-foot plant), duty timing,
foot swing amplitude (px @1080), foot lift, knee travel, pelvis/chest bob,
arm counter-swing arc + whether BOTH arms swing, torso lean while moving,
and walk vs combat-strafe differences. Convert amplitudes ÷1.875 to stage
px. Land in `config/anim.ts`: upgrade each number INFERRED → MEASURED with
`t=` provenance; update `tests/config-values.test.ts` in the SAME commit
(double-entry). Fighter sprite-height baseline for normalizing: measure it
in the same frames (feeds step 5).

### 3. Measure combat arcs (headless-OK)

From `duel-move` + the B-05 fight windows: windup→strike→recover frame
counts per swing, hit-recoil displacement/duration, death collapse timing
(A-22: fall beat before the silhouette hold). → config tables, same rules.

### 4. Wire locomotion + arcs (TDD; headless except the final eyeball)

- Sim already knows movement (`moveX`, positions/velocities per tick) —
  feed horizontal speed into `FighterAnimator` each frame: **stride phase
  advances with DISTANCE TRAVELED, not wall time** (no foot-skating), legs
  swing + arms counter-swing per the measured amplitudes, facing flips with
  movement direction, idle-breath resumes at rest.
- Strike arcs: drive windup/strike/recover from the sim's existing events
  (`enemyTelegraph`, damage, swings) at the MEASURED frame counts; hit
  recoil on damage; death collapse on `fightEnded`.
- Animator state machine stays in `core/` (zero literals — every number in
  `config/anim.ts`); DuelScene stays render-only (pose in, draw out).
- Unit tests red-first: pose deltas at exact frame counts from the measured
  tables (e.g. "after N frames at speed v, front foot has advanced ≥ X").
  Chaos: disconnect the locomotion feed → the walk test must go RED.

### 5. Proportions pass (fidelity-v2 slice 3, folded in — same files)

Measure off clean 1080p duel frames: total sprite height vs screen,
head/kasa width, torso/leg split, blade length, stance silhouettes;
cross-check the lossless `reference/wiki-png/` shots. Apply to
`config/poses.ts` + `game/samurai.ts` (original linework, measured ratios).
Deliverable: side-by-side composite in the scratchpad + an honest verdict
line in the session log. The 55/55 gate must stay green afterwards.

### 6. Browser verification (INTERACTIVE / human-eyes — loop must QUEUE this)

`npm run dev` → walk A/D: legs stride, arms counter-swing, no skating;
strikes show windup→hit→recover on BOTH fighters; kill shows collapse;
`await __fidelity.run()` still 55/55 (run it async and poll — a throttled
tab takes 60–120 s; keep the tab visible); zero console errors fresh-load.
Optional but high-value: a screen-recorded clip next to the OG window for
the blind A/B feel check (scratchpad only).

### 7. Close (mandatory, whoever finishes — loop or interactive)

Ledgers (DIVERGENCES entry for any measured correction · TELLS row 20
skeletal/scarf + row 6 arcs) · `RESUME_HERE.md` same-commit ·
**write `SESSION9_KICKOFF.md` at close** (standing rule, owner 2026-07-16:
every session ends with the next kickoff, copy-paste ready, polished, with
an explicit does-it-reach-the-bar self-report).

## Gate (binary — close when ALL green)

| # | Item | Verify |
|---|---|---|
| 1 | Walk-cycle + arc numbers MEASURED in config with `t=` provenance (no INFERRED left in WALK) | config diff + double-entry test green |
| 2 | Legs stride + arms counter-swing driven by locomotion; no foot-skating; facing flips | browser eyeball + red-first unit pins |
| 3 | Windup/strike/recover arcs live on BOTH fighters at measured frame counts | browser + unit pins |
| 4 | Hit recoil + death collapse | browser |
| 5 | Fidelity gate 55/55 after all changes; suite + tsc + eslint green; zero console errors | pastes |
| 6 | Proportions measured + applied; side-by-side composite delivered | scratchpad path in log + verdict line |
| 7 | Ledgers + RESUME_HERE + SESSION9 kickoff (with bar self-report) in the closing commit | `git show --stat` |

## Landmines (hit once already — don't re-learn)

- **Loop single-writer**: PAUSE-file dance before touching the repo
  interactively (GOAL.md "Re-steering" section has the exact protocol).
- **Gate runs from MCP/CDP**: launch `__fidelity.run()` async into a window
  var and poll — a direct await times out at 45 s under tab throttling.
- **Ratchet**: new `game/` literals fail until the deliberate
  `UPDATE_GAME_PURITY_BASELINE=1` refresh; the reviewed diff is the receipt.
- **Double-entry**: `config/anim.ts` and `config/palette.ts` values are
  pinned in `tests/config-values.test.ts` — change both in one commit.
- **core/ zero literals**: animator math constants go to `config/`.
- **Hitboxes stay Stage-2 rects** (limb capsules deferred — M0 note); the
  24-seed harness must stay 24/24 untouched.
- **Probe points near text are fragile** — new HUD text must be checked
  against the probe map (measure our render after, like the bar labels).
