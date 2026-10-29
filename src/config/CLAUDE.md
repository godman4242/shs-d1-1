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
  policy this file used to state was **superseded** by the owner project ruling
  (2026-07-24, root `CLAUDE.md`): direct frame-match is now the target.
- Spec-pinned values are double-entered in `tests/config-values.test.ts` on purpose:
  changing a value means updating BOTH files in the same commit. That friction is the
  ratchet, not a bug.

## THE TWIN RULE — two config values the ORIGINAL reaches by two paths

A **twin** is two values in `src/config/` that hold the same number because the original
game holds it in two places, not because they happen to coincide. Slice 3 made this
judgement call three times with no written rule, so each one was re-litigated. The rule:

| situation | do this | why |
|---|---|---|
| both sides ship in the **SAME slice** (new files, nothing green depends on them yet) | **IMPORT** one from the other | zero blast radius, and an imported value cannot drift at all — e.g. `OG_STAG.idle` **is** `OG_HORSE.idle`, by reference |
| one side **already SHIPPED** | **TEST-PIN** equality; never edit the green file | never churn a green file to satisfy a new one — e.g. `OG_ANIMAL.xp` vs `OG_WOLF.xp`, `OG_ALPHA.setLevel.floor` vs the spear boss's |
| the two hold the **same number for DIFFERENT rules** | **DENY-LIST** it, with the reason | pinning a coincidence freezes it, and makes a future correction to one side impossible |

**Every declared twin — and every declared non-twin — is enumerated in
`tests/configTwins.test.ts`.** A new twin is not declared until it is in that table.

### ⚠️ THE DENY-LIST IS THE HARD PART, AND IT IS NOT OPTIONAL

Three real pairs in this repo hold **identical values for different rules**, and pinning
any of them would be a bug that looks like a gate:

- `OG_STAG.chargeSpeed` is **15** and `OG_ANIMAL.runSpeedRoom` is **15** — a charge is not
  a run, and the stag's charge deliberately does NOT step down in the overworld where its
  RUN does. Two of the three 15s in this family ARE twins; this one is not.
- `OG_ALPHA.runSpeed` is **15** and `OG_WOLF.run.room` is **15** — the alpha has a scalar
  where the wolf has a room/overworld PAIR, so there is nothing to be a twin of.
- `OG_BEAR.idle.dice` is **3** and `OG_HORSE.idle.dice` is **3** — one picks
  IDLE/SIT/FIDGET, the other IDLE/GRAZING/PAWING.

And the word "twin" in a comment does not settle it: `OG_SPEAR_ELITE.boss.trivialLevel`
is documented as a twin of `OG_NPC_SET_LEVEL.trivialLevel` and the two numbers are **5 and
10**. It is a twin RULE, not a twin VALUE. A test that trusted the word would have gone red
the day it was written.

### How to write a deny-listed pair

Follow the shape `tests/ogSkillData.test.ts` already uses for `SKILL_COOLDOWN_MS.stab`:
assert what makes them different, rather than asserting nothing.

```ts
// values equal, rules different: assert the rule, never the equality
expect(OG_STAG.chargeSpeed).toBe(15);
expect(a.walkSpeed).toBe(-OG_STAG.chargeSpeed);   // and NOT -OG_ANIMAL.runSpeed
```

## Landmines
- Don't invent constants that "feel missing" (e.g. `BLADE_WIDTH`, `BLOOD_PARTICLES`
  don't exist and mustn't). Stage specs name every constant; follow them exactly.
- `fx.ts` (Stage 1) and `combat.ts` both carry blood/blade constants for different
  render paths — they are NOT duplicates to consolidate.
