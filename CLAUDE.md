# CLAUDE.md — SSHD 1:1

From-scratch, original-asset recreation of the Flash game *Straw Hat Samurai: Duels*
(LutGames / Explosive Barrel, died with Flash 2021). Goal: 1:1 feel. Staged build with
binary verification gates — the full spec is committed at `docs/MASTER_SPEC.md`
(verbatim original kickoff + errata; the errata block wins on conflicts); current
state and next step live in `RESUME_HERE.md`.

## Invariants (don't propose work that violates these)
- **THE TWO GAMEPLAY VIDEOS ARE THE PRIMARY 1:1 REFERENCE** (`reference/videos/`,
  both 1080p; ~700 stills already extracted under `reference/frames/`). Copy what
  is in them, directly. The extracted payload is the skeleton — equipment art,
  clothing, VFX and feel survive ONLY in the videos. **Before grading any visual
  claim, open a frame and look**; crop and upscale first (the fighter is ~270 px
  tall in a 1080p frame). When a measurement doc and a frame disagree, **the frame
  wins** — say so. Working second-hand from a measurement doc is how SESSION 18's
  A4-D came to grade a bare doll against a clothed fighter.
- **LICENSED 1:1 RECREATION (owner ruling 2026-07-24 — supersedes the old
  "never traced/transcribed" art line and the 2026-07-12 palette policy).**
  Kheshav attests WRITTEN permission from Lut Games (rights holder): Kongregate
  PM + email. Tracing/matching Lut's art and exact OG hues is now permitted.
  Full ruling + caveats: `docs/OWNER_PERMISSION_RULING.md`. What still holds:
  evidence copies belong in `reference/permission/` (gitignored); third-party
  assets (fonts, licensed music, CC-BY-SA wiki text) are NOT covered; reference
  material is study-only, local-only, never distributed; assume non-commercial
  scope until the grant's wording is re-checked.
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
- **Chaos: `npm run chaos`** — the plant harness (`scripts/gates/chaos.ts`). Applies every
  declared plant in `tests/*.plants.ts` one at a time, requires the named tests to go RED,
  restores byte-identically, and fails on anything else. `-- --list` prints the plants
  without touching a file; `-- <substring>` filters (a debugging aid, **not** the gate).
  ⛔ **Never in pre-commit — it rewrites shipped source.** It is a SLICE GATE: run it
  before claiming a slice closed. `tests/chaosGate.test.ts` is the half that *is* in
  pre-commit: it resolves every plant's anchor without applying any of them, so anchor
  drift goes red on the commit that causes it.
- **Claimcheck: `npm run claimcheck`** (`scripts/gates/claimcheck.ts`) — resolves every
  `<File>.as:<line>` in `src/config/**` and `src/core/npc/**` against the real decompiled
  source, and cross-checks every CITED numeric config value against the line it claims to
  come from (±1). Read-only and ~0.5 s, so it is in the pre-commit gate via
  `tests/claimcheck.test.ts`. It needs `reference/` (gitignored, study-only); without it
  the run says loudly that it checked NOTHING and the corpus half of the test skips.
  It found three genuinely wrong cites on its first run, all of them IN RANGE — so
  existence checking alone would have passed them.
- The gate scripts are run by **Node directly** (native TypeScript, hence
  `engines.node >= 22.18`) — no runner, no new dependency.

## Quality gate
- Pre-commit runs typecheck → tests (see `.githooks/pre-commit`). Commit = green.
- Per-turn ship-bar contract auto-injects from `.claude/ship-bar.md`.

## Session discipline
- `RESUME_HERE.md` (repo root) — **rewritten, never appended to**, in the SAME commit as
  the change it describes. Delete the block you supersede; "refreshed" let stale blocks pile up.
- `docs/sessions/-SESSION-LOG.md` — updated per milestone, never "at the end."
- Folder-local rules: `src/core/CLAUDE.md`, `src/config/CLAUDE.md`, `src/game/CLAUDE.md`.
- Cite symbols, not line numbers.
