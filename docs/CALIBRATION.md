# CALIBRATION.md — measured-value ledger for INFERRED config

Adopted from `~/kheshav-code/iaido-duel` (mining pass 2026-07-12): a single
ledger tracking which tuned values have been MEASURED against the original vs
merely SEEDED. Calibration is a **parallel refinement pass, never a build
gate** — no stage blocks on a CONFIRMED upgrade.

Rules:
- Every row cites its config symbol; the double-entry pin in
  `tests/config-values.test.ts` must move in the SAME commit as the value.
- CONTRACT values (research-verified) do not live here — this ledger is for
  INFERRED seeds awaiting measurement. `docs/research/original-game-facts.md`
  holds the CONTRACT verdicts.
- **Upgrade method (study-only, RECREATE-NEVER-RIP compliant):** run the
  original SWF locally under Ruffle (or Flashpoint), frame-step the scenario,
  read the value (frame counts / eyedropper hex / px), overwrite the seed,
  flip Status to CONFIRMED with source + date. Nothing from the SWF is
  extracted or shipped; `reference/` stays gitignored.

| # | Item | Config symbol(s) | Tolerance target | Current seed | Status |
|---|---|---|---|---|---|
| 1 | Stage size & aspect | `display.ts` GAME_WIDTH/HEIGHT | exact px | 1024×576 (16:9 letterboxed) | INFERRED |
| 2 | Palette | `palette.ts` COL | exact hex via eyedropper | near-OG reading of study frames (owner veto 2026-07-12 pins the near-OG direction) | INFERRED |
| 3 | Red slash arc | `fx.ts` SLASH_ARC | width ±1 px, hang/fade ±20 ms | body 26 / core 11 / taper 1.6·0.1 / hang 200 / fade 180 | INFERRED |
| 4 | Blade trail | `combat.ts` BLADE_* | width ±1 px, fade ±20 ms | two-layer chi edge + white core, pinched tips | INFERRED |
| 5 | Blood burst | `combat.ts` BLOOD_* + DuelScene feel literals (LIFE 650 ms, GRAVITY 780, ratchet-baselined) | count exact, spread ±5° | 9/16 droplets, 42° cone, 60–240 px/s | INFERRED |
| 6 | Kill/finisher beat | `fx.ts` FINISHER_FLASH | freeze ±1 frame, ramp ±20 ms | 420 ms flash, snap-in 60 ms, slow-mo 0.35, hold ~0.9 s wall | INFERRED (SYNTHESIS §4 hard-cut reading) |
| 7 | Shunpo | `combat-sim.ts` SHUNPO_* | factor + drain/fill rates | 0.35× · max 100 · drain 34/s · min-start 10 · fill 12/s | INFERRED (not observable in Duels footage — SHS2-register design) |
| 8 | Gesture thresholds | `gesture.ts` GESTURE_DIAG_DEG 45, LAUNCH_FLICK_MAX_LEN 90 | behavior-match under Ruffle replay | length proxies flick speed (no per-point timestamps) | INFERRED (open decision #9; revisit at feel pass) |
| 9 | AI stance-telegraph queue | `ai.ts` AI_PENDING_STANCE_MS | ±1 frame | 600 ms behind a 'stance' flash | INFERRED |
| 10 | AI reaction semantics | `ai.ts` reactMs as attention cooldown | behavior-match | one decision roll per reactMs window | INFERRED reading (flagged; veto = drop reactions) |
| 11 | Combo chain gap | `combat.ts` COMBO_CHAIN_GAP_S | ±0.5 s | 3 s; resets to 1 on kill (that part CONTRACT) | INFERRED |
| 12 | Kunai application | `combat-sim.ts` PROJECTILE_DMG 8 (spec-exact) | n/a | flat, defense-ignoring application | application INFERRED, value spec-pinned |
| 13 | Arena bounds & spawns | `duel.ts` DUEL_SPAWNS / arena clamp | ±4 px | spawns 400/624 @ ground 430 | INFERRED |
| 14 | HUD geometry | DuelScene layout literals (M8 ratchet baseline) | pos ±4 px, exact hex | built from B-23 study frame | INFERRED |
| 15 | Duel pacing | `ai.ts` DUEL_TARGET_SECONDS {20,60} | median in band | measured median 26.04 s (24-seed harness, M7). Spec's "~24.7 s" is the reference bot's own number, not the game's — do not chase it | MEASURED (our build) |
| 16 | Chi economy | `chi.ts` CHI_MAX / CHI_FILL_PER_S / CHI_COST | cost per skill exact, regen ±1/s | 100 · 4/s · {punch 30, smoke 25, stab 10} — zero frame-backed cost reads exist; sized for the prototype meter family | INFERRED (Stage-3 M3) |
| 17 | XP curve tail (L11+) | `xp.ts` XP_DELTA_STEP | threshold ±5% vs any future high-level HUD read | +500/level delta growth extrapolating the CONTRACT L1–L10 table (observed tail 4550→5000→5500) | INFERRED (Stage-3 M2; the table itself is CONTRACT) |

History: created at Stage-2 close. No row is CONFIRMED yet — Ruffle
frame-stepping is queued as a Stage-6 polish pass (feel-critical rows 3–6
first). Rows graduate one by one; never batch-bless.
