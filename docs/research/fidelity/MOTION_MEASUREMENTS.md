# Motion measurements — Session 8 (2026-07-17)

Measured animation timing/amplitudes from the v0.717 longplays (study-only,
`reference/videos/`, gitignored). METHOD: ffmpeg 60fps frame extracts of
verified windows → pixel-difference cadence analysis + fixed-camera
foot-plant reads (fine-grid strips) + one surviving workflow viewer agent
(`duel-strike-A`, run `wf_087914b1-a51`, journal in the session transcript
dir). Numbers are facts (frame counts, px); no art was copied. Standing
ruling: assertion follows MEASUREMENT — re-measure rather than widen.

Conversion: study px @1080 ÷ 1.875 = stage px (our canvas is 1024×576).
Video B = `Nr4fQstqHDM` (SOUND360TM), video A = `zFtCaTO0_1M` (guest).

## MEASURED — landed in config (double-entered in tests/config-values.test.ts)

| Fact | Value | Evidence | Config home |
|---|---|---|---|
| Animation pose rate | **15fps** (pose steps every 4th video frame, strict) | B duel t=3774–3775: consecutive-frame grayscale MAE ≈0 except every 4th frame (MAE 2.9–19.1); one deliberate 8-frame clash hold | `ANIM_TIMING.poseStepMs = 1000/15` (DuelScene pose latch) |
| Walk stride period | **16 video frames ≈ 267ms** (4 anim steps/stride) | B t=465.0–466.3 fixed camera (walk-b05b frames 089–133): legs split f097–101, pass f105, split f109–113; agrees with walk-nw autocorr (half-period 8f) | drives `WALK.stridePx` below |
| Walk speed | ~7–9.5 px/f @1080 (≈ 240–300 stage px/s) | same window: char center x 1230→1650 over 44f | (sim speeds already pinned Stage 2) |
| **Walk stride length** | **~135 px @1080 → 72 stage px** | period × speed (16f × ~8.4 px/f) | `WALK.stridePx = 72` — stride phase advances by distance/stridePx, never time |
| Foot swing (coarse) | visible split ~60 px @1080 → ±16 stage px | same strip; hakama occludes ankles — re-verify queued | `WALK.footSwing = 16` |
| Foot lift (coarse) | ~10 px @1080 → 6 stage px | same strip | `WALK.footLift = 6` |
| Hit stagger | **12 frames total: 4 upright + 8 bent-forward** | duel-strike-A: frames 036–047 after streak | `ANIM_TIMING.hitRecoilMs = 67`, `hitReturnMs = 133` |
| Knockback on hit | ~55–70 px @1080 (≈ 30–37 stage px), all in the first anim step | duel-strike-A frame 036 hat displacement | visual only (HIT_RECOIL pose family); sim untouched |
| Death collapse | tip-airborne → ground **12f**, settled **20f ≈ 333ms**; body knocked BACKWARD rotating to horizontal; sword detaches and drops beside the corpse (tell, queued) | A one-hit kill t≈3315.5 (crumple frames 149 hit → 153 tip → 165 ground → 173 rest) | `ANIM_TIMING.deathMs = 333` |

## MEASURED — recorded, not yet applied (next slices)

| Fact | Value | Evidence |
|---|---|---|
| Strike anatomy (dash-slash) | approach ~10 px/f → windup hold 4f (1 anim step) → **lunge lands in ONE anim step** (~167–236 px @1080) → clash freeze 8f (when blocked) → slash streak lives 4f → damage popup +4f after streak | duel-strike-A events, B t=3774–3775 |

## MEASURED — landed in config (Session 8B, 2026-07-17)

| Fact | Value | Evidence | Config home |
|---|---|---|---|
| **SLASH_FRAMES per stance** | Strike-to-strike intervals (no movement): 12f / 16f / 20f for light / balanced / heavy. Windup = 4f (constant, 1 anim step hold). Active = 4f (constant, 1 anim step lunge). Recovery = 4f / 8f / 12f (varies by stance). | Pixel-difference MAE cadence analysis of duel-move frames (B t=3774–3780, 360 frames @60fps): big motion events at frames 031, 047, 063, 075, 095, 107 → intervals 16/16/12/20/12; the 12f/16f/20f cycles map to light/balanced/heavy recovery lengths | `SLASH_FRAMES` in `config/timing.ts` (double-entered in `tests/config-values.test.ts`) |
| Full-screen hit tint | red tint ON 16 frames on the big counter hit (mean R−G 0.7→61.8→0.8) | duel-strike-A frames 032–047 |
| Two gaits exist | upright short-step WALK (above) vs leaning ~45° bounding RUN: ~14 px/f, stride ~16f ⇒ ~225 px @1080 (~1.0× sprite height); overworld travel + duel run-ins use RUN | b05b frames 057–085 vs 089–133; jog-a28; duel-strike-A "enemy-enters 7–10 px/f" |
| Standing sprite height | ~220 px @1080 → ~117 stage px (matches our ~120 px build) | duel-spawn frame t=426.8, kasa top y≈660 → feet y≈880 |
| Combat idle is a semi-crouch | knees bent, wide base, blade low-forward (not our upright IDLE). **APPLIED 2026-07-17 (Session 8B): `IDLE_POSE` in `config/poses.ts` rebuilt to the semi-crouch (pelvis +4, knees ±9/−8, feet ±14, chest +6 lean, hand low-forward); exact-pin in `tests/skeleton.test.ts`, red-proofed against the old upright pose** | same frame, all three fighters |
| Duels open with dash-attacks | first exchange is already a lunge at t+0.4s; fighters WALK only between exchanges | duel-move frames 001–060 |
| **WALK bob** | detrended hat_y peak-to-trough ≈ **0.9% of sprite height** while walking (3.5px @377px sprite, walk-nw f226–253) → `WALK.bob = 1` stage px (was INFERRED 3). Fast run reads up to ~3%h (jog-a28 f114–129) | walk-nw/jog-a28 CSVs, windowed detrended analysis (Session 8B inline) |
| **Arms are weapon-locked in motion** | NO pedestrian counter-swing: all three duel viewers report weapon-locked arm poses during approach/run/step; walk-nw travel frames show the two-hand blade carry → `WALK.armSwing = 0` (was INFERRED 7); behaviour pin updated in `tests/anim.test.ts` | wf_466b63b2-966 duel-approach/strike-B/strike-C + walk-nw f240 eyeball |
| **Idle breath is tiny** | standing windows (33–60f) show detrended hat-bob **≤0.5% of sprite height** (0–2px @ ~380px); one 19f stand fully motionless → `IDLE_BREATH` halved (head 0.6 stage px). YouTube compression floors 1px reads — treat as upper bound | walk-nw f006–041/f102–122/f134–193, jog-a28 f001–033/f206–240; strike-C idle note |
| **Player death-fall = enemy crumple family (CONFIRMED, was ASSUMED)** | inline read of death f120–300: fatal tick ~f162, red overlay SNAPS to full silhouette tableau in one tick at f166, body knocked backward rotating to horizontal, weapon/shield detaches (airborne at f180), settled ≤20f — matches the crumple read; `deathMs 333` applies to both fighters | death corpus pixel-diff + frame reads 150/162/166/180 (Session 8B inline) |

## MEASURED — landed in config (Session 9, 2026-07-17)

| Fact | Value | Evidence | Config home |
|---|---|---|---|
| **Dash-through slash displacement is a 1-frame snap** | attacker translation completes in EXACTLY ONE video frame (+240 / +~240 / −235 px @1080 across 3 dashes — mean ≈238.3 ÷ 1.875 = 127.1), then landing pose holds 4–12f; the red streak renders AFTER arrival. **APPLIED 2026-07-17 (Session 9): `DASH_SLASH_PX = 127` in `config/combat-sim.ts`; Sim.applyStroke snaps the player along the stroke's net-x on every fighting-phase slash (pass-through, arena-clamped chaos-proven, no dash airborne/zero-net/slip-length). Review-hardened same session: at most ONE dash per SLASH_FRAMES swing cycle — the measured strike-to-strike interval doubles as the OG's own rate limit — plus `DASH_MIN_STROKE_PX = 40` (INFERRED). Bounds + vetoes in DIVERGENCES (Session 9 block). Browser-proven: 260→387 exact via real drag; spam holds at one dash/cycle; landing hold = existing SLASH_FRAMES recovery pose** | strike-C (HONDA SHIZUKA mop-up, f176–248) | `DASH_SLASH_PX`, `DASH_MIN_STROKE_PX` (double-entered in `tests/config-values.test.ts`) |

## MEASURED — recorded, NOT yet applied (candidates, Session 9+)

| Fact | Value | Evidence |
|---|---|---|
| Knockdown/downed state exists | launcher lifts victim ~200–230px (~1.05× char height), airborne ~40f, then prone; get-up head-lift ~40f after last hit; finisher attacks target the downed body | strike-B f096–150, strike-C f150–248 |
| Damage popups | spawn at victim, rise ~90–120px @1080 over ~19–30f while fading; grey-out near end | strike-B/C popup tracks |
| Full-screen hit tint family | ~7f (pass-through hit) / 12f (launcher) / 16f (big counter) — duration scales with hit weight | strike-A/B/C tint counts |
| Locomotion may latch at 30fps | run/step poses latch in 2-video-frame pairs (30fps) vs 4-frame action poses (15fps) — MEDIUM confidence, conflicts with the b05b 15fps walk read; RE-MEASURE before touching `poseStepMs` | strike-C footwork {169,170}/{172,173} pairs |
| Windup holds vary on special moves | jump-slash and ground-finisher hold the overhead windup 8f (2 anim steps); basic 3-stance windup stays 4f (SLASH_FRAMES intervals unchanged, corroborated by strike-B's 5-attack log) | strike-B attacks 4–5 |

## PENDING — re-measure queue (9 viewer agents died on the session limit; resets 4:50am +08 2026-07-18)

RE-RUN COMPLETED 2026-07-17 evening (`wf_466b63b2-966`): duel-approach +
strike-A/B/C returned (results folded into the tables above); jog-nw /
jog-a28 / crumple / death-fall / strike-D died on the session cap twice —
their items were then SALVAGED INLINE the same night (CSV windowed
analysis + direct frame reads; rows above). Still-open viewer value, all
DISCRETIONARY for Session 9: strike-D extra swings (SLASH_FRAMES already
pinned from 9 intervals + strike-B's 5-attack log), close-up foot-plant
reads (footSwing/footLift stay coarse), the 30fps-locomotion-latch check
(row above). Resume line if wanted:
`Workflow({scriptPath: '<784a688d session>/workflows/scripts/motion-measure-8b-wf_466b63b2-966.js', resumeFromRunId: 'wf_466b63b2-966'})`
— completed agents replay from cache (same-session only).

- duel-approach footwork detail (frames 001–060) — partially covered inline
- duel-strike-B/C/D: more swings → TIGHTEN SLASH_FRAMES (current: coarse 3-stance read from 9 intervals; more swings would confirm or refine)
- jog-nw + jog-a28 amplitude sets (arm counter-swing arc, bob, lean) — the
  hakama-occluded WALK amplitudes above get their tightening here
- walk-slow (b05a) — window turned out to be a sector-transition fade; DROP
- ~~crumple~~ MEASURED INLINE (row above, applied) — the agent re-run may
  only tighten the ±4f read
- death-fall (A t=3358–3363): player fall → silhouette hold beats — ASSUMED
  same collapse animation as the enemy crumple for now (`deathMs` applies to
  both); the re-run should confirm

Frame corpus (scratchpad, session-local): walk-b05a/b, walk-nw, jog-a28,
duel-move, crumple-a22, death, agent-crops/* — re-extract with the ffmpeg
lines in SESSION8_MOTION_KICKOFF.md §1 if the scratchpad is gone (fix
walk-b05a: use 464–468 and 490–497, not 397/425).
