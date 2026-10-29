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
- **1:1 RECREATION (project ruling 2026-07-24 — supersedes the old "never
  traced/transcribed" art line and the 2026-07-12 palette policy).**
  Tracing and matching Lut's art and exact OG hues is in scope. Full ruling +
  caveats: `docs/MASTER_SPEC.md`. What still holds: evidence copies belong in
  `reference/` (gitignored); third-party assets (fonts, licensed music, CC-BY-SA
  wiki text) are NOT covered; reference material is study-only, local-only,
  never distributed; assume non-commercial scope.
- **Stack is fixed:** Phaser 3 (pinned `phaser@3`, NOT v4) + TypeScript 5 + Vite,
  Vitest, WebAudio-synthesized SFX only, procedural vector art only (no image files).
- **Dependency direction:** `src/game/` may import `src/core/` + `src/config/`; `src/core/`
  may import `src/config/` only; `src/config/` imports nothing outside itself. Never reverse.
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
  source, and cross-checks cited numeric config values in BOTH directions at ±0: every
  value is on a line its cites name, and every cite names a line holding a value it
  governs. Read-only and ~0.2 s, so it is in the pre-commit gate via
  `tests/claimcheck.test.ts`. It needs `reference/` (gitignored, study-only); without it
  the run says loudly that it checked NOTHING and the corpus half of the test skips.
  ⚠️ Its first version reported "0 failures" over four VERIFIED wrong cites (one value
  checked against the union of its cites, at ±1, and bare `export const`s not read at
  all) — closing those raised 82. A correct cite that states no governed value (a
  contrast, a cross-reference) goes in its `CONTEXT` list with the cited line read and the
  reason written; never widen the window.
- The gate scripts are run by **Node directly** (native TypeScript, hence
  `engines.node >= 22.18`) — no runner, no new dependency.

## Quality gate
- Pre-commit runs typecheck → tests → lint (see `.githooks/pre-commit`). Commit = green.
  A markdown-only commit takes the fast path, which still runs `npm run instructionpaths`
  — the gate on prose has to run on the commits that are pure prose.
- Per-turn ship-bar contract auto-injects from a global `UserPromptSubmit` hook in
  `~/.claude/settings.json`. It is NOT in this repo: 995bb52 deleted the local copy so the
  global one could not be shadowed, and this line went on naming the deleted file for nine
  days — which is why `npm run instructionpaths` now exists.

## Session discipline
- `RESUME_HERE.md` (repo root) — **rewritten, never appended to**, in the SAME commit as
  the change it describes. Delete the block you supersede; "refreshed" let stale blocks pile up.
- `docs/sessions/-SESSION-LOG.md` — updated per milestone, never "at the end."
- Folder-local rules: `src/core/CLAUDE.md`, `src/config/CLAUDE.md`, `src/game/CLAUDE.md`.
- Cite symbols, not line numbers.
