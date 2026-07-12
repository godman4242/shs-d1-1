# TELLS_CHECKLIST.md — living ledger for the MASTER_SPEC fidelity tells

Adopted from `~/kheshav-code/iaido-duel` (mining pass 2026-07-12, session log):
their tells file is a LIVING ledger — per-tell status + evidence citation —
where ours sat static in the spec. **Definitions stay in `docs/MASTER_SPEC.md`
(FIDELITY TELLS section, errata wins); this file is only the status ledger.**
Update a row in the same commit as the change that flips it.

Status: ☑ passing (evidence cited) · ◐ partial · ☐ pending · Ⓗ human-only
(queued for Kheshav — cannot be auto-verified).
Evidence timestamps refer to `docs/sessions/-SESSION-LOG.md`.

## Slash engine
- ☑ 1. Stroke → smooth swept curve — Stage-1 gate: zoom screenshot, DrawnStroke resample; `DrawnStroke.test`.
- ☑ 2. Two-layer tapered ribbon (white core + chi edge, pinched tips) — Stage-1 gate zoom evidence; M10 trail screenshots.
- ◐ 3. Horizontal=slash, up=jump, up-flick=launch, down=stab — slash/jump/stab live (gesture.test, Stage-1/2 gates); LAUNCH routed in gesture but skill-verb launch is Stage-3+ scope.
- ☑ 4. Jump start.x→end.x arc — Stage-1 gate: sim reads {400,430}→{406.6,310.8}→{430,430}; `trajectory.test`.
- ◐ 5. HP-based damage, one line hits multiple foes — HP-based ☑ (100→88→76→64 Stage 1; 150→142 Stage 2). Multi-foe: duel is 1-v-1 by design until Stage 4/5 world combat.
- ☑ 6. Per-stance arcs differ — stance/slash tests (Light reach/speed vs Heavy); config pins.

## Combat
- ☑ 7. Critical bar drains per swing (heavy>light), crit payout — critical.ts + crit A/B tests (M2/M9). DEVIATION: ×1.3 not ×3 — open decision #1, `docs/DIVERGENCES.md`.
- ☑ 8. SPACE swap costs Focus; triangle holds — M6 browser (55.87→5.07 real key; denial at 50); stance triangle tests.
- ☑ 9. 5 s spawn invuln, blinking, ends on first slash — M3 tests (PLAYER-ONLY, flagged); M9 blink capture; blink wall-clock cadence kept in M10.
- ☑ 10. Smoke Bomb dodge + Stab+Deflect swat — M3 tests (i-frames; deflect window; deflectLearned once); M6 key-3 CD via real input.
- ☑ 11. Foes move slowly, granting charge time — ENEMY_SPEED 0.17 pinned; M7 harness charge windows.
- ☑ 12. Chi Punch = 10 dmg — M3 test, CONTRACT flat 10 + 4.96 s CD.

## AI / feel
- ☑ 13. Telegraph ≥ telegraphMs before landing — M4 property test (600-frame run, exact-at-telegraphMs); M6/M10 windup aura live.
- ☑ 14. Normal duel winnable+losable ~20–60 s — M7: 24/24 good-play vs 0/24 no-play, median 26.04 s.
- ☑ 15. Kill beat distinct from Shunpo — M6 kill→result cycle; M9 shunpo-force-stop fix; M10 keeps kill beat on wall clock.
- ☑ 16. Shunpo drains meter — M3 tests; M10 live: ts 0.35, meter 100→94.2.

## Art / motion
- ☑ 17. Flat-color bold-outline vector look — samurai.ts v2 (fighters rebuilt from study frames, 13:40 entry) + browser evidence.
- ☑ 18. Kasa + katana + scarf silhouette — samurai.ts v2 (kasa brim/weave, two-hand grip, scarf tails).
- ☑ 19. Directional blood along the cut — Stage-1 gate (right-cut sprays right / left-cut left); M10 droplet ballistics on fx clock.
- ☐ 20. Scarf/hat secondary motion in idle/move — not yet (fighters are pose-static between poses); Stage-6 polish candidate.
- ☑ 21. Parallax arenas, high-contrast fighters — bamboo/pastel parallax + letterbox (M6, from A-00 frame).

## UI / audio / flow
- ☐ 22. Camera framing/tracking matches reference — static camera today; camera study is a Stage 4/6 item.
- ◐ 23. Portrait LEFT, coins TOP-LEFT, XP TOP-RIGHT, skill bar 1/2/3 — all present (M6, B-23 anatomy); minimap = world-scope (Stage 4).
- Ⓗ 24. HUD bar colors/shapes/fill match reference — anatomy built from B-23; pixel-match grading queued for Kheshav's eye + CALIBRATION rows.
- ☑ 25. VS splash + name banner + result — M6/M9/M10 captures (VS card, RONIN banner, READY…FIGHT!, Victory +10/+8, Defeat +0/+0).
- ☐ 26. Title typography (brush display + body face) — Stage 6 (no title screen yet; fight-first boot is the prototype shape).
- ☐ 27. Menu ≠ combat music, victory/defeat stings — Stage 6 audio (WebAudio-synth only).
- ☐ 28. Four-way slash SFX on measured frames — Stage 6 audio.

## Progression / campaign / lore (Stages 3–5)
- ◐ 29. Level-up = +1 SP, +3 stat, full refill — CORE MATH landed Stage-3 M1 (`progression.ts` `levelUp`, exact-pin `progression.test`); in-game level-up modal + XP curve pending (item 4 / Stage 4).
- ◐ 30. Rebirth payout + elemental stacking — CORE MATH landed M1 (`rebirth`: +10 chosen-elemental stacking to N=10, earlyGold 1–9 / tenthGold 10th; `progression.test`). Renamed economy field attack→elemental (decision #3). In-game rebirth scroll UI pending (Stage 4).
- ◐ 31. 80 SP cap; max dan rank — ENFORCED + chaos-proven M1 (SP cap first-run-only; ceiling at MAX_DAN_RANK, rebirth-past-ceiling throws). DEVIATION: MAX_DAN_RANK=10 per errata + decision #2 (spec tell says 5) — `docs/DIVERGENCES.md`. In-game rank display pending (Stage 4).
- ◐ 32. Coins grindable, Gold earnable, no cash purchase — economy + `Progression` carry both currencies M1 (gold via `rebirth`, coins via `accrueCoins`); HAS_CASH_PURCHASE=false pinned. In-duel accrual + persistence across R-restart pending (item 4, browser).
- ☐ 33. Season>Episode nesting, Prologue tutorial, haiku cards — Stage 5.
- ☐ 34. Ragged Shugyosha start with a branch — Stage 5.
- ☐ 35. Clan/character roster — Stage 4/5 (four joinable Great Clans + Aoi Hoiru, Ki Sensu; Shira Tancho story-only; all dialogue ORIGINAL — invariant).
- ☐ 36. War Room L10 gate, kill cap 350 — Stage 5 (WAR_ROOM pins landed M5).
