# CLAUDE.md — SSHD 1:1

From-scratch, original-asset recreation of the Flash game *Straw Hat Samurai: Duels*
(LutGames / Explosive Barrel, died with Flash 2021). Goal: 1:1 feel. Staged build with
binary verification gates — the full spec is committed at `docs/MASTER_SPEC.md`
(verbatim original kickoff + errata; the errata block wins on conflicts); current
state and next step live in `RESUME_HERE.md`.

## Invariants (don't propose work that violates these)
- **RECREATE, NEVER RIP.** No decompiled code, no extracted art, no ripped audio.
  Reference videos are study-only, live in `reference/` (gitignored), never distributed.
- **Palette is deliberately trade-dress-shifted** ±5–8% HSL from the original.
  Never "correct" it back toward the original.
- **Stack is fixed:** Phaser 3 (pinned `phaser@3`, NOT v4) + TypeScript 5 + Vite,
  Vitest, WebAudio-synthesized SFX only, procedural vector art only (no image files).
- **Dependency direction:** `game/` may import `core/` + `config/`; `core/` may import
  `config/` only; `config/` imports nothing outside itself. Never reverse.
- **`src/core/` has ZERO numeric literals** and no package imports (enforced by
  `tests/config-purity.test.ts`). Every gameplay number lives in `src/config/`,
  labeled CONTRACT or INFERRED.
- **Phaser scenes are render-only** — they never own gameplay state; `Sim` (fixed
  60Hz, injected mulberry32 RNG, no `Math.random` in core) owns everything.
- Do not advance to the next stage until the current stage's gate is 100% green.
- Chaos-test every guard: plant the failure, watch red, fix, watch green.

## Stack & commands
- Dev: `npm run dev` · Build: `npm run build` · Typecheck: `npm run typecheck`
- Test: `npm test` (vitest run) · Watch: `npm run test:watch`

## Quality gate
- Pre-commit runs typecheck → tests (see `.githooks/pre-commit`). Commit = green.
- Per-turn ship-bar contract auto-injects from `.claude/ship-bar.md`.

## Session discipline
- `RESUME_HERE.md` (repo root) — refreshed in the SAME commit as the change it describes.
- `docs/sessions/-SESSION-LOG.md` — updated per milestone, never "at the end."
- Folder-local rules: `src/core/CLAUDE.md`, `src/config/CLAUDE.md`, `src/game/CLAUDE.md`.
- Cite symbols, not line numbers.
