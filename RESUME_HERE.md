# RESUME HERE

> **Fresh session and Kheshav said only "continue"?** Read this file top to
> bottom, then `docs/sessions/SESSION4_KICKOFF.md` (standing mandates), then
> `git log --oneline -10`. Trust those three over any older doc.
> Fidelity ledgers: `docs/TELLS_CHECKLIST.md` · `docs/CALIBRATION.md` ·
> `docs/DIVERGENCES.md` (adopted from iaido-duel mining, 2026-07-12).

## Awaiting human/browser verification (Stage 3)
- **Gate item: kill a foe → XP/coins visibly accrue and persist across
  R-restart.** Needs a real browser + the persistence seam (work-order item 4,
  not yet built). A headless cycle cannot check it — left unchecked, queued.
  The economy *math* is done and unit-proven (`progression.ts`, M1); what
  remains is the game/ localStorage boundary + a browser run.

## Current focus
**Stage 3 — Progression: IN PROGRESS. M1 (`core/progression.ts`) DONE
(2026-07-12).** 6 of 7 Stage-3 gate items cleared headless + chaos-proven
(Stage-3 gate table under "State"); the 7th is browser-only (queued above).
Entry point stays `docs/sessions/STAGE3_KICKOFF.md`.
**Stage 2 CLOSED 100% ☑ (2026-07-12)** — its gate table is under "State".
SESSION4 kickoff items 1–4 all done; local commits, push = Kheshav's call.

## State
- **Stage 3: IN PROGRESS — M1 (`core/progression.ts`) DONE (2026-07-12).**
  Suite 333/333 · tsc both configs exit 0 · eslint exit 0. 6/7 gate items
  cleared headless; item 7 is browser-only (queued at top).
  | Gate item (STAGE3_KICKOFF §3, errata-read) | Evidence |
  |---|---|
  | progression unit tests green | 28/28 in `tests/progression.test.ts`; full suite 305→333 |
  | Level-up: exactly +1 SP, +3 stat, full HP/Chi/AP refill | `levelUp` exact-pins (SP=+1, stat=+3, drained pools → current==max on all three) |
  | Rebirth: +10 elemental, stacks N times | property test to N=MAX_DAN_RANK (fire → 10×10=100; water stays 0); distributes across elements when re-picked |
  | 80 SP first-run cap enforced | 200 level-ups → SP pinned at 80 (chaos: cap disarmed → 200 RED); cap lifts after rebirth (danRank>0) |
  | Dan rank MAX_DAN_RANK(=10) is max | `canRebirth` false at rank 10; rebirth-past-ceiling throws (chaos: guard disarmed → RED). DEVIATION MAX=10 (decision #2) — DIVERGENCES |
  | Two currencies (Coins grindable, Gold earnable), HAS_CASH_PURCHASE=false | `Progression` carries coins (via `accrueCoins`) + gold (via `rebirth`), move independently; HAS_CASH_PURCHASE=false pinned |
  | Browser: kill → XP/coins accrue + persist across R-restart | ☐ QUEUED (browser + persistence seam, item 4) — see top of file |
- **Stage 2: GREEN — gate 100% ☑ (2026-07-12, Session 4).** Suite 305/305 ·
  tsc both configs exit 0 · eslint exit 0 · milestones M1–M10 on `master`
  (session log 2026-07-11→12; evidence timestamps below refer to it).
  | Gate item (MASTER_SPEC Stage 2) | Evidence |
  |---|---|
  | ≥200 unit tests green | 305/305 at M10 close (log 19:25); pre-commit gate paste in every milestone commit |
  | Sim deterministic, same seed+intents, cross-process | M7 (log 10:03): in-process ×2 byte-identical + two child vitest processes + parent all agree; chaos: planted `Math.random` in trace → RED (plant sized above the 1/256 fingerprint fold) |
  | `tsc --noEmit` exit 0 | both tsconfigs, enforced by pre-commit gate; pasted per commit |
  | dev server → `?scene=duel` → playable duel | DuelScene IS the boot scene (`main.ts`: only route until Stage 6, param a no-op); played live M6 + M10 (slash, damage, kunai, shunpo) |
  | VS → name banner → READY → FIGHT! in order | M6 full-cycle browser run; M9 VS-card capture; M10 FIGHT! banner screenshot |
  | Draw across enemy → slash → blood → damage | M6: 150→142 (exact 8); M10 repeat: 150→142 + 9 droplets + two-layer trail (screenshots) |
  | SPACE swaps stance, Focus bar visibly drains | M6: denied at 50 Focus, then heavy swap 55.87→5.07 via real key; M9 drain capture |
  | Crit ×CRIT_MULT A/B | crit A/B scenario tests (M2, spec item 14 sweep). DEVIATION: CRIT_MULT=1.3 vs spec "3×" — open decision #1, default keep |
  | SHIFT-hold slow-mo: timescale + meter drain | M6: 0.35 on sim + BOTH Phaser clocks, restored on release; M10: fx/wall 1.0000→0.3500→1.0000 measured, meter 100→94.2, FX age exactly 350 ms per 1000 ms wall |
  | R restarts cleanly | M6: fresh sim, timescales exactly 1, intro relaunched; M9: stale-intro + occluded-tab clock-jump fixes (browser-found) |
  | Enemy telegraphs ≥ 520 ms before striking (Normal) | M4 property test: strike lands exactly telegraphMs after its telegraph over a 600-frame run; windup aura live in M6/M10 |
  | Back off → kunai flies (range band) | M10 live: hold A → kunai thrown at range 468 (band 240–720) after 60 frames, bolt on screen (screenshot); M9 fixed the dead 620–720 band |
  | Stab (key 3) swats kunai | M3: deflect-window + deflectLearned-once tests (spec item 14 stab-deflect scenario); M6: key-3 cooldown via real input |
  | Victory screen: XP +10, Coins +8 | M6 + M9 screenshots (+10/+8 exact — economy.ts pins coins=8 NOT 5) |
  | Defeat screen: 0/0 | M9 capture: Defeat +0/+0 |
  | Spawn invuln: 5 s blink, ends on first slash | M3 tests (PLAYER-ONLY, flagged; veto = symmetric); M9 blink capture; blink kept on WALL clock in M10 (real-time cadence in slow-mo) |
  | 24-seed harness: 100% win good-play, 0% no-play, median in band | M7: 24/24 wins vs 0/24, median 26.04 s ∈ [20,60], 24/24 distinct durations. NOTE: spec "~24.7 s" is the reference bot's own number — flagged |
  | config-purity: core/ zero literals; game/ baseline clean | Stage-1 chaos (planted 42 → RED at file:line) still green; M8 ratchet chaos (31337 plant, 4→9 substitution → RED) + M9 hardening + M10 RED receipt (0: 45→47 reviewed) |
- **Stage 1: GREEN — gate 100% ☑ (2026-07-12, autonomous overnight session).**
  155/155 tests (every new test watched RED first; TDD skill invoked at session
  start) · ESLint strict-type-checked green · `tsc --noEmit` exit 0 on BOTH
  tsconfigs · adversarial audit workflow `wf_925893f5-430` (18 agents): 7
  confirmed findings ALL fixed + proven, 11 claims refuted with evidence.
  | Gate item | Evidence (session log 2026-07-11 Session 3) |
  |---|---|
  | ≥30 unit tests green | 155/155 across 12 files |
  | Chaos ±1e308 → finite, red-proofed | finite-guard disarmed → NaN leaked + length Inf (2 RED) → restored → GREEN |
  | tsc both configs exit 0 | pasted in log |
  | dev server → forest + fighter | Chrome screenshot; Phaser 3.90 WebGL banner |
  | line across fighter → trail + blood | zoom screenshot: white core inside bladeChi edge, pinched tips |
  | line up → jump start.x→end.x arc | sim-state reads: {400,430}→{406.6,310.8}→{430,430}, jumping false |
  | HP-based damage (100 HP foe, partial) | on-screen bar 100→88→76→64 (exact 12s) |
  | two-layer blade trail | same zoom evidence |
  | blood along cut direction | right-cut sprays right; left-cut sprays left (screenshots) |
  | config-purity re-chaos | planted `42` in core → RED at file:line → removed → GREEN |
  | ESLint (decision #4) | adopted; LINT_CMD wired in pre-commit |
  | Chrome zero console errors | "No console errors or exceptions found" pasted |
- **Stage-1 bugs found by browser verification (all fixed, tests first):**
  render-tied sim ticks (→ fixed-step wall-clock accumulator in DuelScene),
  mid-air ground capture on re-jump (→ Sim groundY anchor + one-jump-at-a-time),
  dropped stroke release point, off-canvas release swallowed ('pointerupoutside'),
  full-damage taps at the core seam (→ <2-point gate), SLASH_ARC taper conflation,
  game-import guard fail-open (.js/phaser-subpath/dynamic — now fail-closed).
- **Core modules live:** vec · geometry (+polylineLength) · gesture ·
  DrawnStroke · stance · slash · trajectory (pulled forward) · Sim (Stage-1
  surface: fighter state, applyStroke, tick). Config: nums · gesture · fx ·
  duel (all pinned in config-values.test.ts, incl. the 13 spec-named
  stroke/blade/blood combat.ts constants).
- Versions: phaser 3.90.0 (pinned @3), typescript 5.9.3, vite 8.1.4,
  vitest 4.1.10, eslint 9 + typescript-eslint 8.
- `scripts/build-loop.sh` + `docs/loop/GOAL.md` exist as CRASH INSURANCE only
  (single-writer rule: never run while an interactive session works the repo).

## Next concrete step
**Stage-3 M1 (levelUp/rebirth math) DONE.** Next milestone toward the gate,
per STAGE3_KICKOFF §2 work order:
- **M2 — XP-curve research** BEFORE inventing one: check
  `docs/research/original-game-facts.md` + wikis for level thresholds (the
  "0 / 550" B-23 HUD reading is one sample, not a curve). Dry research →
  INFERRED curve, flagged, ONE named config site. Wire XP→`levelUp` in core.
- **M3 — Chi meter + skill costs** (the Stage-2 deferral): Chi in Sim, skills
  1/2/3 gain Chi costs, HUD Chi bar. Chaos: cost > meter → denied, no CD spent.
- **M4 — accrual + persistence seam** → clears the queued browser gate item
  (kill → XP/coins accrue + persist across R-restart; profile math in core,
  localStorage at the game/ boundary, DEV-clearable).
Works under the build loop — GOAL.md is current and routes through this file.

## Stage-2 milestone history (all on `master`, evidence in session log)
Stage 2 build order was: rng DONE · Sim.advance DONE (M1) ·
M2 DONE (202/202): two-fighter Sim (player+enemy FighterState, FighterView
reads, hitbox(side)), damage w/ defense + HEAVY_DEF_PENALTY defense-side only
(landmine honored — exact-8 pin, chaos: double-application → 17 RED), phase
model intro→fighting→ended (pre-FIGHT strokes discarded), Focus+Critical
meters in integer frame-units (multiply-first exact), stance switching (free
out-of-combat CONTRACT / Focus-gated in-combat, cost = FOCUS_SWITCH_COST ×
WEAPON_WEIGHT[stance being LEFT] — veto = key on target), SimEvent[] queue
(fightStarted/fightEnded/damage/stanceSwitched/stanceSwitchDenied),
nextStance SPACE cycle, DuelScene interim: both fighters + HP/Focus bars,
SPACE wired, mulberry32(Date.now()) seed.
M3 DONE (251/251): combo (reset-to-1 on kill CONTRACT, breaks on damage/gap,
COMBO_CHAIN_GAP_S=3 INFERRED) · core/damage.ts single formula site · enemy
strikes via OpponentIntent (airborne evade; player invuln honored) · kunai
projectiles (cap 8, straight-line, flat 8 dmg INFERRED, off-arena despawn) ·
skills 1/2/3 (chiPunch flat 10 CONTRACT + 4.96s CD; smokeBomb dash-away +
i-frames; stab deflect window, deflectLearned gated ONCE in stepKunai) ·
spawn invuln PLAYER-ONLY (5s/first-slash, veto = symmetric) · Shunpo
(hysteresis restart at 10, integer 1/60 units, SHUNPO_FILL_PER_S=12
INFERRED) · PlayerIntent moveX/shunpoHeld (NaN-guarded) + queueSkill ·
DuelScene wired: A/D + SHIFT + 1/2/3, advance(delta × timeScale), kunai
bolts, invuln blink. Chi COSTS deferred to Stage 3 (no Chi meter yet —
flagged).
M4 DONE (274/274): AISeamController — telegraph-then-commit (strike exactly
telegraphMs after its telegraph, property-tested over a 600-frame run),
counter-stance picks queued AI_PENDING_STANCE_MS=600 (INFERRED, pinned)
behind a 'stance' telegraph + Focus-affordability mirror, kunai band
240–720 gated by tier kunaiChance, recover jitter ±35% via rng, react()
block/dodge with reactMs attention cooldown (INFERRED reading — flagged;
veto = drop reactions), injected rng only. Sim executes: enemy moveX at
ENEMY_SPEED (arena-clamped), switchStance through the same Focus-gated
rule, enemyTelegraph + strikeBlocked events; blocked/dodged swings do NOT
consume the crit meter or advance the combo. config/ai.ts spec-item-8
EXACT + pinned. core/time.ts = the one msToFrames site. DuelScene: real
AISeamController (normal tier), shared rng stream, windup flash (red =
strike / blue = stance).
M5 DONE: economy.ts spec-item-10 exact + pinned (MAX_DAN_RANK 10 per open
decision #2; KILL_REWARD INFERRED; HAS_CASH_PURCHASE=false deviation).
M6 DONE (browser-verified, zero console errors): fidelity pull-forward
scenes built FROM study frames — samurai.ts (kasa+katana+scarf flat-color
bold-outline fighters), banners.ts (ONE brush/splatter banner family),
bamboo/pastel parallax arena + letterbox strips, enemy nameplate
"RONIN (1)" + overhead green bar, portrait (stance ring, click-to-swap) +
HP/Focus bars + Shunpo/Critical slivers, skill bar w/ cooldown sweeps,
HIT COMBO plate, AUTO SLASH OFF plate (render-only), low-HP vignette,
coins/XP anatomy; DuelIntro (VS card → RONIN banner → READY… → FIGHT!,
click fast-forwards, pre-FIGHT strokes sim-discarded), DuelResult (hard-cut
red, YOU WIN/DEFEATED, +10 XP/+8 COINS exact, R restart). Browser evidence:
slash 150→142 (exact 8), SPACE denial at 50 focus then swap heavy at 55.87
→ 5.07 (real key), shunpo 0.35 mirrored on time+tweens then restored,
key-3 stab CD via real input, kill → combo reset to 1 → result → R →
fresh sim + timescales exactly 1 + intro relaunched. AI decision-cadence
bug FOUND IN BROWSER (per-tick chance rolls stalled approach) → RED test →
one-roll-per-reactMs fix → 281/281.
M7 DONE (287/287): 24-seed harness — good-play bot (jump-dodges strike
telegraphs, seeded humanized swing tempo) wins 24/24, no-play loses 24/24,
median 26.04 s (range 20.7–33.2, spec band [20,60], reference ~24.7 is
their bot's number — flagged), 24/24 distinct durations; determinism —
in-process ×2 byte-identical + CROSS-PROCESS via two child vitest runs +
parent, all three agree; chaos: planted Math.random in the trace → RED
(after discovering the fingerprint's 1/256 fold quantization hid a 1e-9
plant — plant sized above the floor). Spec item 14 scenario coverage
landed across M2–M4 (crit A/B, invuln, smoke, stab-deflect, chi punch,
shunpo, kill-beat-once, telegraph ≥ telegraphMs, stance triangle).
M8 DONE (289/289): game/ purity ratchet live — per-file numeric-literal
multisets in tests/game-purity-baseline.json; new/substituted values FAIL
(chaos-proven: planted 31337 → red naming file+value+count; substituted
4→9 → red '×2 allows ×1'), removals pass, new files fail until baselined;
refresh = UPDATE_GAME_PURITY_BASELINE=1 (git diff is the review surface).
**NEW SESSION ENTRY POINT: `docs/sessions/SESSION4_KICKOFF.md`** — read it
first; it carries the standing mandates (pushback / Duels-not-SHS /
single-player-first / near-OG palette policy) + the ordered work list
(FX clock fix → gate table → mine iaido-duel → upgrade agent-work-ethic →
Stage 3).
M9 status: two browser-found scene-lifecycle bugs fixed (stale intro on
mid-intro duel restart — launch() is a no-op on an active scene; intro
fast-forward on occluded-tab clock jump — re-anchored, the original paused
when hidden). Gate evidence captured: VS card, Defeat +0/+0, invuln blink, Victory
+10/+8, stance swap drain. Audit RAN (36 agents): 7 confirmed findings ALL
FIXED red-first (AI stall/kunai band, mid-tick double-fightEnded, shunpo
stuck at kill, intro-buffered skills, critical.ts extracted, display pins,
jump clamp) + ratchet hardened (main.ts scan, payload parity, tick guard,
RED-receipt refresh). Suite 297/297.
M10 DONE (305/305): FX clock fix (the last audit finding) — core/fx.ts
(advanceFxClock + integrateDroplet, pure, red-first ×8; Euler order pinned),
DuelScene fxNow += delta × active-ts drives trail/stroke/droplet aging +
integration + telegraph/guard cues (flagged; veto = cues back to wall
clock); kill-beat hold + invuln blink stay wall-clock (kickoff contract).
Feel constants stay scene literals under the ratchet (config landmine:
no invented blood constants). Browser-proven via dev-seam loop-step:
fx/wall 1.0000 → 0.3500 (SHIFT held) → 1.0000; droplet aged exactly 350 ms
per 1000 ms wall in slow-mo; slash 150→142 with trail alive at fx-age
153 ms after ~350 ms wall; zero console errors from fresh load.
**STAGE 2 CLOSED — the full gate table with evidence lives under "State".**
NOTE (Kheshav feedback 2026-07-12): Stage 2 scene work must pull the fidelity
tells forward — see the kickoff §2 amendment; build FROM the study frames.

## Open decisions awaiting Kheshav (each with proposed default)
1. **CRIT_MULT 1.3** (was spec 3) — default keep; Stage 2 "crit 3×" gate items
   read "crit ×CRIT_MULT". Veto = revert combat.ts + config-values.test.ts.
2. **MAX_DAN_RANK 10** (Stage 3) — default 10. LANDED M1 as the rebirth
   ceiling (`progression.ts`); still owner-vetoable → revert to 5 = edit
   economy.ts + config-values.test.ts + the DIVERGENCES entry.
3. **Rebirth = elemental +10, stacking** (Stage 3) — default elemental.
   LANDED M1 (field renamed `elementalPointsPerRebirth`; flat +10, NOT the
   research 10th-rebirth +20 nuance). Veto = restore attack semantics / add
   `tenthElemental` (see DIVERGENCES).
4. ~~ESLint~~ DONE (Stage 1). Veto = delete eslint.config.mjs, empty LINT_CMD.
5. **new-project.sh invalid JSON** — installer fix still outside this repo.
6. **Phaser 4 exists** — stay pinned 3.90.0 permanently (default).
7. **Branch `master`** — default keep.
8. **Dev-only `window.__game` seam** (main.ts, DEV-guarded, stripped from prod)
   — default keep for automated verification. Veto = delete the if-block.
9. **Gesture thresholds INFERRED** (`GESTURE_DIAG_DEG=45`,
   `LAUNCH_FLICK_MAX_LEN=90`; length proxies flick speed — no per-point
   timestamps). Default: keep, revisit at Stage 2 feel pass.

## What not to break
- Root `CLAUDE.md` invariants: RECREATE-NEVER-RIP (drawings/dialogue always
  original; palette now near-OG per owner veto 2026-07-12) · core/
  zero-literals · dependency direction · render-only scenes · binary stage
  gates. Folder rules: `src/{core,config,game}/CLAUDE.md`.
- `tests/fixtures/scan-probe/` is load-bearing (scanner regression fixtures).
- The game-import guard + purity gate are chaos-proven — keep them fail-closed.

## Stage landmines from research (apply at the noted stage)
- **Stage 2**: `HEAVY_DEF_PENALTY` (defense ×0.8) vs `damageTakenMult 1.25` —
  apply ONE, never both. Stance is HARD-LOCKED in combat in v0.717 PvE
  (SYNTHESIS §6.1) — implement out-of-combat switch as CONTRACT + Focus-gated
  in-combat variant as INFERRED. Spawn invuln has a confirmed blink indicator.
  `critical.ts`: two meters (Focus = stance switch, Critical = crits). PvE
  trash resolves 3–10 s — DUEL_TARGET_SECONDS {20,60} is a boss/PvP number.
  Combo counter resets to 1 (not 0) per kill; breaks on damage taken/chain gap.
  NaN-guard Sim.advance inputs (audit refuted Stage-1 scope, binds Stage 2).
- **Stage 4/5**: four joinable Great Clans (+ Aoi Hoiru, Ki Sensu); Shira
  Tancho story-only. War Room: 75 deploy, 500 per-structure donation,
  flag 120%. HAS_CASH_PURCHASE=false is a deliberate deviation.

## Spark / backlog (noticed, not acted on — why later)
- game/ config-purity ratchet baseline (per-file value multiset) — Stage 2
  item 15; DuelScene literals are tolerated until then.
- DuelScene fixed-step accumulator DONE (Stage-1 browser bug); Sim.advance
  (deltaMs, MAX_FRAME_MS=250 in config) replaces the inline 250 at Stage 2.
- Phaser bundle 1.2 MB → code-split at Stage 6.
- `@types/node` 26 vs Node 25 — harmless; align when LTS catches up.
- Vite dev server may still be running in background task b1jaqmhl1.
