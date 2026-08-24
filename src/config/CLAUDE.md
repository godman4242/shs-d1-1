# src/config/ — all gameplay numbers

**Purpose:** the ONLY home for gameplay values. Pure data exports — no logic, no
functions, no classes, no Phaser.

## Invariants
- ⚠️ **Labels are REVIEW-enforced, not test-enforced** (corrected 2026-08-24). No test
  parses them: `grep -c 'CONTRACT\|INFERRED' tests/config-purity.test.ts` → 0, and every
  hit in `config-values.test.ts` is a comment. `ai.ts` still ships `AI_TIERS` unlabeled.
- Values and purity ARE test-enforced (`tests/config-purity.test.ts`, `tests/config-values.test.ts`).
- Every value is labeled **CONTRACT** (verified original behaviour), **INFERRED**
  (tuned seed), or **Spec-fixed** (architecture mandate from the kickoff spec, e.g.
  `FIXED_HZ`). Keep the label honest when you touch a value.
- Research verdicts for CONTRACT claims live in `docs/research/original-game-facts.md`
  — check there before "correcting" a value from memory.
- Imports may only resolve inside `src/config/` (type-only imports between config
  files are fine — see `timing.ts` importing `StanceId`).
- `palette.ts` sits at **exact OG hues**. The 2026-07-12 "drawings stay original"
  policy this file used to state was **superseded** by the owner permission ruling
  (2026-07-24, root `CLAUDE.md`): direct frame-match is now the target.
- Spec-pinned values are double-entered in `tests/config-values.test.ts` on purpose:
  changing a value means updating BOTH files in the same commit. That friction is the
  ratchet, not a bug.

## Landmines
- Don't invent constants that "feel missing" (e.g. `BLADE_WIDTH`, `BLOOD_PARTICLES`
  don't exist and mustn't). Stage specs name every constant; follow them exactly.
- `fx.ts` (Stage 1) and `combat.ts` both carry blood/blade constants for different
  render paths — they are NOT duplicates to consolidate.
