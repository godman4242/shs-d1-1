# src/core/ — pure combat math

**Purpose:** framework-free, deterministic gameplay logic. `Sim` is the single owner
of gameplay state; scenes only render what it computes.

## Invariants (test-enforced — `tests/config-purity.test.ts`)
- **ZERO numeric literals.** No allowlist — not even `0` or `1`. Need a number?
  Name it in `src/config/` (CONTRACT or INFERRED) and import it. Pure-math constants
  (e.g. `ONE` for `1 - t` in lerp) go in a `src/config/nums.ts` when Stage 1 needs them.
- **No package imports.** Imports must resolve inside `src/core/` or `src/config/`.
  No Phaser, no node builtins, nothing bare.
- **No `Math.random`** — inject `Rng` (mulberry32; its magic constants will live in
  `src/config/rng.ts`). **No `Date.now()`** — time is fixed-Hz frame counts.

## Landmines
- Literals in *type positions* (`type X = 5`), enum initializers, default params, and
  template expressions all fail the purity scan. Implicit enum ordinals pass — don't
  exploit that to smuggle numbers.
- `Number('42')`, `parseInt`, `Infinity` are scanner escape hatches — banned by intent,
  caught in review, not by the scanner.

## How to test
- `npx vitest run tests/config-purity.test.ts` — purity gate.
- Per-module unit tests live in `tests/` (e.g. `tests/vec.test.ts` from Stage 1 on).
- Chaos rule: guards are proven by planting the failure first (red), then fixing (green).
