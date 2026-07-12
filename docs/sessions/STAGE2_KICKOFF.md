# STAGE 2 KICKOFF — Full combat (paste-companion for a fresh session)

**Paste-prompt for a new session (one line):**
> Read `docs/sessions/STAGE2_KICKOFF.md` and execute it. Do not stop until the
> Stage 2 gate is 100% green with evidence pasted, or you are blocked on a
> decision only I can make.

Self-contained: the contract is `docs/MASTER_SPEC.md` STAGE 2 (+ the ERRATA
block, which wins on conflict); this file only sequences it and binds the
video-study findings. Written at Stage-1 close (2026-07-12), while the whole
codebase was fresh in context.

---

## 0. Read first (in this order, before any code)

1. `RESUME_HERE.md` — Stage 1 gate evidence + landmines list.
2. `docs/MASTER_SPEC.md` STAGE 2 section — items 1–15 + gate. ERRATA: crit
   gate items read "crit ×CRIT_MULT" (config 1.3, never hardcode 3);
   `KILL_REWARD` stays INFERRED; `DUEL_TARGET_SECONDS` is boss/PvP tuning.
3. `docs/research/video-study/SYNTHESIS.md` — §1.1 (combat core), §6 items
   1/5 (stance lock; boss-HP reset), §7 Stage-2 rows (skills/cooldowns/
   combo/respawn), §4 (feel: kill beats, pacing, low-HP vignette).
4. Folder rules: `src/{core,config,game}/CLAUDE.md`. TDD skill FIRST.

## 1. Scope — exactly MASTER_SPEC Stage 2, in this build order

1. `src/config/rng.ts` + `src/core/rng.ts` — mulberry32 (constants in config;
   core has zero literals). Everything deterministic depends on it: land first.
2. `Sim.advance(deltaMs)` skeleton — fixed 60Hz accumulator, MAX_FRAME_MS=250
   clamp, NaN/negative-delta rejection (chaos-test: plant, red, fix, green).
   Replaces DuelScene's inline accumulator + inline `250`.
3. Damage resolution inside Sim (defense, DAMAGE_FLOOR, HEAVY penalty — see
   §2 landmine), Focus + Critical meters (`critical.ts`), stance switching.
4. `combo.ts` (reset-to-1 on kill; break on damage taken / chain gap — §7),
   `projectile.ts` (kunai), Chi Punch / Smoke Bomb / Stab+Deflect, spawn
   invuln (5 s or first slash), Shunpo, kill beat (fires exactly once).
5. `AISeamController.ts` — telegraph-then-commit; injected rng only.
6. Config: `ai.ts`, `combat-sim.ts`, `economy.ts` — spec-exact names/values,
   ALL pinned in `tests/config-values.test.ts` in the same commit (Stage 1
   audit finding: unpinned constants are silent-edit holes).
7. Scenes (render-only): DuelScene full HUD, DuelIntro (VS → banner → READY →
   FIGHT!, pre-FIGHT strokes discarded), DuelResult (R restarts, no leaked
   timescale — chaos-test the restart).
8. Tests: Sim scenarios per spec item 14; 24-seed harness; `save.ts` optional.
9. game/ purity ratchet baseline (spec item 15) — land AFTER the scenes
   stabilize, else the baseline churns every commit.

## 2. Video-study bindings (decisions pre-made; veto notes inline)

- **Stance switching (SYNTHESIS §6.1):** v0.717 PvE hard-locks stance in
  combat. Build BOTH: out-of-combat instant toggle (CONTRACT) and the spec's
  in-combat Focus-cost switch (INFERRED — matches Critical Evade's "Focus Bar
  full" language). The gate item "SPACE swaps stance, drains Focus" tests the
  INFERRED variant. Veto = in-combat lock only, gate item reworded.
- **Heavy penalty — apply ONE form:** defense ×(1−HEAVY_DEF_PENALTY), i.e.
  the research-corroborated defense-side cut (A-14 tooltip). STANCE_TABLE's
  `damageTakenMult` stays data-only for heavy (do NOT also apply it). Document
  at the application site. Veto = swap forms, never both.
- **Two meters, two names:** Focus (stance switch, FOCUS_*) vs Critical
  (crit payout, CRITICAL_*) — spec prose conflates them once; `critical.ts`
  owns Critical, stance-switch cost reads FOCUS_SWITCH_COST.
- **Pacing:** trash mobs 3–10 s at level parity (§1.1); the 24-seed harness
  median ~24.7 s targets the boss/PvP-shaped duel of the spec. Don't "fix"
  trash-speed kills to chase the harness number.
- **Combo:** resets to 1 (not 0) per kill; breaks on damage taken and chain
  gaps (§7 COMBO_RULES, CONTRACT).
- **Kill beat feel (§4):** hard cut, ~0.6–1 s hold, ink-splatter reveal;
  FINISHER_FLASH constants already in config/fx.ts.
- **Spawn invuln:** 5 s + blinking indicator (research CONTRACT), ends on
  first slash.
- **Skills (§7, CONTRACT):** Chi Punch 10 dmg L1 / 2 Chi / 4.96 s CD —
  cooldowns are frame-quantized (.92/.96 endings); keep that pattern for any
  INFERRED cooldown values.
- **NaN guard:** the Stage-1 audit scoped attacker-stat NaN-guarding to
  Sim.advance — it binds HERE (chaos-test it).
- **Visual fidelity pulled forward (Kheshav feedback, 2026-07-12):** the
  Stage-1 testbed "does not look like the OG game" — correct, and no longer
  acceptable for Stage 2's scenes. When building DuelScene/DuelIntro/
  DuelResult, work FROM the study frames (`reference/frames/`, A-00/A-02/
  B-23 anatomy) and pull fidelity tells 17–19 and 21–25 forward: flat-color
  bold-outline fighters with kasa+katana+scarf silhouette, bamboo/pastel
  parallax arena, combat letterbox strip, enemy nameplate "NAME (LEVEL)" +
  overhead green HP bar, portrait/coins/XP HUD anatomy, VS/FIGHT! banner
  family. Palette stays trade-dress-shifted (invariant — never revert);
  "byte-by-byte" reads as "1:1 in motion", per MASTER_SPEC's own terms.

## 3. Definition of done — binary gate (ALL boxes, evidence pasted)

The MASTER_SPEC STAGE 2 VERIFICATION GATE verbatim (≥200 tests, determinism
cross-process, playable duel, VS→FIGHT! order, SPACE stance swap, crit
×CRIT_MULT A/B, SHIFT slow-mo, clean R restart, telegraphs ≥520 ms Normal,
kunai at range, stab swat, Victory +10/+8, Defeat 0/0, invuln blink, 24-seed
harness, purity core+game baseline) — plus:
- ☐ Every new test watched failing first (TDD skill at session start)
- ☐ Chaos-proofs: Sim NaN/∞/negative delta · timescale leak on restart ·
  purity re-chaos · game-import guard still fail-closed
- ☐ ESLint green · tsc both configs · Chrome zero console errors (evidence)
- ☐ Adversarial audit workflow before sign-off; confirmed findings fixed
- ☐ `RESUME_HERE.md` + session log updated in the SAME commits

## 4. Session discipline (unchanged, binding)

TDD skill first; chaos-test every guard; decide-and-flag with veto notes;
stop-rule: same root cause fails 3× → one-line diagnosis before continuing;
commit per milestone (pre-commit gate green); no Stage 3 work until this gate
is 100% ☑. Goal is 1:1 — research contradictions instead of trusting memory;
do not be a yes-man.
