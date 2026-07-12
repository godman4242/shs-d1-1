# RESUME HERE

## Current focus
**Stage 2 — Full combat** (MASTER_SPEC Stage 2: deterministic Sim loop, AI seam,
meters, projectiles, playable duel, ≥200 tests). Stage 1 closed 100% green on
2026-07-12 (see gate evidence below). Kickoff sequencing for Stage 2:
`docs/sessions/STAGE2_KICKOFF.md` (written at Stage-1 close; read it first).

## State
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
**Stage 2 in flight** (kickoff §1 order): rng DONE · Sim.advance DONE (M1) ·
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
Next (kickoff §1 item 4): `combo.ts` (reset-to-1 on kill, break on damage
taken / chain gap — §7 COMBO_RULES), then `projectile.ts` (kunai), skills
(Chi Punch / Smoke Bomb / Stab+Deflect via PlayerIntent + SKILL_VERB), spawn
invuln (5 s or first slash + blink), Shunpo, kill beat (exactly once). Then
M4 AISeamController + ai.ts config, M5 economy.ts, M6 scenes w/ fidelity
pull-forward, M7 24-seed harness + determinism, M8 game/ purity ratchet,
M9 audit + gate evidence.
NOTE (Kheshav feedback 2026-07-12): Stage 2 scene work must pull the fidelity
tells forward — see the kickoff §2 amendment; build FROM the study frames.

## Open decisions awaiting Kheshav (each with proposed default)
1. **CRIT_MULT 1.3** (was spec 3) — default keep; Stage 2 "crit 3×" gate items
   read "crit ×CRIT_MULT". Veto = revert combat.ts + config-values.test.ts.
2. **MAX_DAN_RANK 10** (Stage 3) — default 10.
3. **Rebirth = elemental +10, stacking** (Stage 3) — default elemental.
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
- Root `CLAUDE.md` invariants: RECREATE-NEVER-RIP · shifted palette stays
  shifted · core/ zero-literals · dependency direction · render-only scenes ·
  binary stage gates. Folder rules: `src/{core,config,game}/CLAUDE.md`.
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
