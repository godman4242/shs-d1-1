# RESUME HERE

## Current focus
**Stage 1 — Slash engine.** The reference-video study is COMPLETE (2026-07-11):
61 verified segments (main sweep 48/48 + follow-up 12/12), synthesis written.
1. Read `docs/research/video-study/SYNTHESIS.md` first — §1.1 (combat core),
   §4 (feel), §6 (contradictions: stance-lock-in-combat is the big one for the
   slash engine), §7 (new config constants by stage).
2. **Stage 1 TDD**: `src/core/vec.ts` → `geometry.ts` → `DrawnStroke.ts` →
   `gesture.ts` → `slash.ts` → `stance.ts`, then DuelScene.
   Invoke the TDD skill; red-proof every guard (esp. the ±1e308 overflow chaos test).
   New from video for Stage 1–2: drag-to-slash red stroke render, AUTO SLASH
   toggle, combo counter rules (reset-to-1 on kill, break on damage/gap),
   "CANNOT CHANGE STANCE" in-combat lock (stance = out-of-combat toggle).

## State
- **Stage 0: GREEN + audited (2026-07-11).** tsc (both configs) exit 0 · 43/43 tests ·
  purity gate chaos-proven (planted literal → red; planted core Phaser import → red;
  planted `.mts` literal → red; removed → green) · boots in Chrome (Phaser 3.90.0
  WebGL banner, letterboxed sky gradient, zero console errors).
- **Verification workflow `wf_16a0092b-8e9`** (5 audits + 3 research agents): palette
  30/30 exact; constants all exact; purity scanner hardened after 2 blockers
  (dynamic-import fail-open, .mts/.cts blind spot) + warns (triple-slash, implicit
  enum ordinals, payload files) — all fixed with regression fixtures in
  `tests/fixtures/scan-probe/`. Toolchain fixes: split tsconfigs (browser code no
  longer sees Node types), index.html touch/centering hardening, Phaser.WEBGL
  explicit, engines pin. `.claude/settings.json` had INVALID JSON (installer bug) —
  ship-bar hook was silently dead; fixed + validated.
- **Research verdicts** in `docs/research/original-game-facts.md`:
  11 confirmed · 4 partial · 3 unverifiable · 2 contradicted.
- Versions: phaser 3.90.0 (pinned @3), typescript 5.9.3 (pinned @5), vite 8.1.4, vitest 4.1.10.

## Next concrete step
Write `tests/vec.test.ts` (add/sub/dot/cross/len/norm/lerp/dist, red first), then
implement `src/core/vec.ts` importing any needed pure-math constants from a new
`src/config/nums.ts` (ZERO/ONE/TWO/HALF — core/ allows no literals, not even 1).

## Video-study outputs to consult during Stages 1–5
- `docs/research/video-study/SYNTHESIS.md` — mechanics catalogue §1, story §2,
  UI inventory §3, feel §4, research cross-check §5, contradictions §6,
  **new config constants table §7** (XP curve, skill cooldowns, AP costs, buffs,
  prices), skipped-slice list §8, targeted re-watch wishlist §9.
- 61 evidence files in `docs/research/video-study/segments/` (every number
  timestamp-cited); frames cached under `reference/frames/` (gitignored).

## Open decisions awaiting Kheshav (each with proposed default)
1. **CRIT_MULT changed 3 → 1.3** on research evidence (see `combat.ts` docblock +
   research doc). Default: keep 1.3; Stage 2's "crit 3×" gate items become
   "crit ×CRIT_MULT". Veto = revert in `combat.ts` + `tests/config-values.test.ts`.
2. **MAX_DAN_RANK** (Stage 3): spec says 5, research says 10 (Shodan→Jūdan, 10th
   final; spec's own `tenthGold` corroborates). Default: 10 at Stage 3.
3. **Rebirth bonus** (Stage 3): not flat +10 Attack — +10 chosen elemental skill,
   stacking (gold schedule 25/100/25 confirmed as specced). Default: implement
   elemental version.
4. **ESLint**: not in the fixed stack; gate's LINT_CMD is empty. Default: add
   eslint + typescript-eslint (flat config) at Stage 1 kickoff.
5. **`~/.claude/new-project.sh` writes invalid JSON** into `.claude/settings.json`
   (unescaped quotes in the hook command) — every future project gets a dead
   ship-bar hook. Fixed here; the installer itself still needs the fix (outside
   this repo — Kheshav must edit it or ask in a session with access).
6. **Phaser 4 exists** (4.2.1 is npm latest). Spec fixes Phaser 3 → pinned 3.90.0.
   Default: stay on 3 permanently.
7. **Branch is `master`**. Default: keep. Say the word to rename to `main`.

## What not to break
- Root `CLAUDE.md` invariants: RECREATE-NEVER-RIP · shifted palette stays shifted ·
  core/ zero-literals · dependency direction · render-only scenes · stage gates are
  binary. Folder rules: `src/{core,config,game}/CLAUDE.md`.
- `tests/fixtures/scan-probe/` is load-bearing (scanner regression fixtures) — the
  `.mts` literal and `payload.json` in there are INTENTIONAL.

## Stage landmines from research (apply at the noted stage)
- **Stage 2**: `HEAVY_DEF_PENALTY` (defense ×0.8) vs `damageTakenMult 1.25` — apply
  ONE, never both. Shunpo-as-slow-mo is our interpretation (INFERRED). Spawn invuln
  has a confirmed blinking indicator. `critical.ts` naming: two meters (Focus for
  stance switch, Critical for crits) — spec prose conflates them once.
- **Stage 4/5**: four joinable Great Clans (+ Aoi Hoiru, Ki Sensu); Shira Tancho is
  story-only. Heraldry: yellow dragon on red field; encircled yellow fist on green.
  War Room: 75 = deploy amount, 500 = per-turn donation amount (not caps);
  flag = 120% troop-deploy boost. Original SOLD gold for cash — our
  HAS_CASH_PURCHASE=false is a deliberate deviation.

## Spark / backlog (noticed, not acted on — why later)
- `src/config/rng.ts` for mulberry32 magic constants — needed Stage 2, not before.
- DuelScene needs its own fixed-step accumulator over Phaser's variable update
  (clamp max steps; MAX_FRAME_MS=250 already specced) — Stage 2.
- Vitest guard so no test transitively imports `src/game/**` (Phaser crashes under
  Node) — add when scene-adjacent tests appear, Stage 1/2.
- Phaser bundle 1.2 MB → code-split at Stage 6; irrelevant during dev.
- `@types/node` major (26) is ahead of local Node 25 — harmless; align when Node LTS
  catches up.
- `reference/` dir for study videos — create when first video lands (gitignored).
