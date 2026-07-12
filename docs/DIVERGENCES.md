# DIVERGENCES.md — every deviation from the documented original, with rationale

Adopted from `~/kheshav-code/iaido-duel` (mining pass 2026-07-12): one ledger
instead of flags scattered across RESUME_HERE, session log, and config
comments. **Rules:** CONTRACT values are never silently changed — if evidence
ever contradicts one, the contract wins and the contradiction is logged here.
Every entry carries a rationale and a one-line veto path. RESUME_HERE "Open
decisions" stays the owner-facing queue; this file is the permanent record.

## Owner-decided (defaults live until vetoed — decision # from RESUME_HERE)

- **CRIT_MULT = 1.3 (spec: 3×)** — decision #1, default keep. Note from the
  iaido-duel mining pass: that project's spec lineage treats 3× as CONTRACT
  and its build measured an exact 3.000 A/B — evidence leans 3× for true
  fidelity. Owner default stands. Veto = revert combat.ts +
  config-values.test.ts in one commit; gate rows read "×CRIT_MULT".
- **MAX_DAN_RANK = 10 (spec tell 31 says 5)** — decision #2, default 10 per
  the errata block (errata wins over spec prose). iaido-duel's contract says 5
  (kyudan) — the two specs disagree; ours is errata-pinned. Stage-3 landing.
- **Rebirth = elemental +10, stacking** — decision #3, default elemental
  (errata). Stage-3 landing.
- **Palette = near-OG hues** — owner veto 2026-07-12 reverted the earlier
  ±5–8% trade-dress shift. Colour schemes are unprotectable; drawings and
  dialogue remain ALWAYS original (the hard line). Never re-shift.
- **Dev-only `window.__game` seam** — decision #8, default keep (DEV-guarded,
  stripped from prod). It carried every browser verification this stage.

## Mechanics readings (INFERRED where the original is ambiguous/unobservable)

- **In-combat stance switch = Focus-gated (v0.717 PvE hard-locks stance)** —
  SYNTHESIS §6.1. Out-of-combat free switch is CONTRACT; the Focus-gated
  in-combat variant is our INFERRED playability reading. Cost = FOCUS_SWITCH_COST
  × WEAPON_WEIGHT[stance being LEFT] (veto = key on target stance).
- **HEAVY_DEF_PENALTY (defense ×0.8) applied defense-side ONLY** — the
  landmine: never also apply damageTakenMult 1.25 (double-count chaos-proven,
  exact-8 pin).
- **Spawn invuln PLAYER-ONLY** (veto = symmetric) — 5 s / first slash,
  blinking indicator CONTRACT.
- **AI reactMs = attention cooldown, one decision roll per window** — flagged
  reading (veto = drop reactions). The per-tick alternative provably stalled
  approach (M6 browser bug → red cadence test).
- **Shunpo on SHIFT-hold** — Duels footage never shows Shunpo; mechanics are
  SHS2-register design-from-lore. SPACE is contractually the stance swap.
- **Kunai = flat 8 damage, defense-ignoring** — PROJECTILE_DMG=8 is
  spec-exact; the flat application is INFERRED.
- **COMBO_CHAIN_GAP_S = 3 s** INFERRED; combo resets to 1 (not 0) per kill —
  CONTRACT.
- **AI_PENDING_STANCE_MS = 600** INFERRED (stance flash telegraph queue).
- **AI_APPROACH_RANGE is Stage-4 world-aggro only** — deleted from duel AI
  (M9: the hard idle produced a dead 620–720 band; a duel is always engaged).

## Structural deviations (deliberate, no behavior claim on the original)

- **HAS_CASH_PURCHASE = false** — deliberate deviation; the original sold
  gold. We ship no purchases, ever.
- **Fight-first boot** — today's boot-straight-to-duel is a PROTOTYPE shape;
  the original's login/menu → story → world → fights flow lands Stage 4/5
  (standing mandate #5). `?scene=duel` is a no-op by design until Stage 6.
- **Chi costs deferred to Stage 3** — skills are cooldown-gated only in
  Stage 2 (no Chi meter yet); the original gates on Chi. Flagged in RESUME.
- **Single-player first** — Duels was multiplayer-with-PvE; we build the full
  single-player game before ANY multiplayer (standing mandate #3).
- **DUEL_TARGET_SECONDS {20,60} treated as boss/PvP band** — PvE trash in the
  original resolves 3–10 s (SYNTHESIS §1.1); our 1-v-1 duel targets the band,
  world trash (Stage 4) will not.

## Cross-project fact conflicts (recorded from the iaido-duel mining pass)

- **Kill reward coins: ours 8, theirs 5.** Our MASTER_SPEC pins
  `coinsPerFoeLevel: 8` with the note "verified from actual economy.ts";
  iaido-duel's build showed "+5". Ours is the verified figure — keep 8.
- **Phaser 3.90 `particleAngle` setter is a no-op** (their M1 adversarial
  find: assigning `{min,max}` mutates `current` only; re-aim requires
  `ops.angle.loadConfig`). Not applicable today (we draw FX with Graphics,
  no particle emitters) — recorded as a landmine if emitters are ever adopted.
