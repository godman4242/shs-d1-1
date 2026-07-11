# STAGE 1 KICKOFF — Slash engine (paste-companion for a fresh session)

**Paste-prompt for the new session (one line):**
> Read `docs/sessions/STAGE1_KICKOFF.md` and execute it. Do not stop until the
> Stage 1 gate is 100% green with evidence pasted, or you are blocked on a
> decision only I can make.

Everything below is what that session must do. It is self-contained: the full
game spec is committed at `docs/MASTER_SPEC.md` (verbatim original kickoff +
errata); this file only *sequences* Stage 1 and binds the video-study findings
to it.

---

## 0. Read first (in this order, before any code)

1. `RESUME_HERE.md` — current state (Stage 0 green + audited; study complete).
2. `docs/MASTER_SPEC.md` — **the STAGE 1 section is the contract** (deliverables
   1–10 + verification gate). Respect the ERRATA block at the top: `combat.ts`
   already carries `CRIT_MULT = 1.3`, not the spec text's 3 — `slash.ts` must
   read the config value, never hardcode.
3. `docs/research/video-study/SYNTHESIS.md` — §1.1 (combat core), §4 (feel),
   §6 items 1+10 (stance lock; HP/CHI bar identity), §7 (config table).
4. Folder rules: `src/core/CLAUDE.md`, `src/config/CLAUDE.md`,
   `src/game/CLAUDE.md` (root `CLAUDE.md` auto-loads).

## 1. Scope — exactly MASTER_SPEC Stage 1

Core (TDD, in this order): `src/core/vec.ts` → `geometry.ts` →
`DrawnStroke.ts` → `gesture.ts` → `slash.ts` → `stance.ts`.
Config: `src/config/fx.ts` per spec (SLASH_ARC / BLOOD_FX / FINISHER_FLASH,
exact names — spec explicitly bans inventing `BLADE_WIDTH` / `BLOOD_PARTICLES`);
stroke + blade-trail + blood constants go in `config/combat.ts` under the
spec's exact names (RESAMPLE_SPACING=8, SMOOTH_ITERATIONS=2, CHAIKIN_RATIO=0.25,
MAX_STROKE_POINTS=256, BLADE_CORE_WIDTH=7, BLADE_EDGE_WIDTH=13,
BLADE_FADE_MS=200, BLADE_MIN_TAPER=0.12, BLOOD_COUNT=9, BLOOD_COUNT_SEVERED=16,
BLOOD_SPREAD_DEG=42, BLOOD_SPEED_MIN=60, BLOOD_SPEED_MAX=240).
Also: `src/config/nums.ts` (ZERO/ONE/TWO/HALF…) — core/ allows no literals,
not even 0 or 1.
Scene: `DuelScene` per spec item 10 — **render-only**; it calls core functions
and draws; it owns zero gameplay state.

## 2. Video-study bindings for Stage 1 (from SYNTHESIS)

- Gesture map is video+research confirmed: horizontal=slash · up=jump ·
  up-flick=launch · down=stab (§5 gestures row). DrawnStroke classification
  must match.
- The slash input renders as a **red directional stroke** at attack moment;
  blade trail is a two-layer tapered ribbon (spec tell #2) — SYNTHESIS §1.1.
- Blood: directional along the cut AND **stains persist on scenery** (§4) —
  Stage 1 needs directional spray; persistent pools may land Stage 2/6.
- `stance.ts` design note: in v0.717 PvE, stance is an out-of-combat toggle,
  hard-locked in combat ("CANNOT CHANGE STANCE", §6 item 1). Stage 1 only
  builds the enum + triangle; do NOT bake in-combat switching assumptions
  into the type design — Stage 2 decides the Focus-gated variant (INFERRED).
- Feel targets for the trail/kill-beat: hard cuts, ~0.6–1 s holds, ink-splatter
  reveal (§4). Palette stays trade-dress-shifted — never "correct" it.

## 3. Additions beyond the spec (queued decisions falling due now)

- **ESLint (RESUME_HERE open decision #4, default = do it):** add
  `eslint` + `typescript-eslint` flat config at kickoff; wire
  `LINT_CMD` in `.githooks/pre-commit`. Veto = skip, leave LINT empty.
- **Vitest guard (backlog item falling due):** when the first scene-adjacent
  test appears, add the guard that no test transitively imports `src/game/**`
  (Phaser crashes under Node).

## 4. Definition of done — binary gate (ALL boxes, evidence pasted)

The MASTER_SPEC Stage 1 gate verbatim:
- ☐ All unit tests green (≥30 tests)
- ☐ Chaos test: ±1e308 input → finite output — **red-proofed** (revert guard →
  watch red → restore → green; paste both runs)
- ☐ `tsc --noEmit` exits 0 (both tsconfigs)
- ☐ `npm run dev` → forest background + fighter renders
- ☐ Line across fighter → blade trail + directional blood
- ☐ Line up → jump (start.x → end.x, arc)
- ☐ HP-based damage (100 HP foe takes partial damage)
- ☐ Two-layer blade trail (white core inside colored edge)
- ☐ Blood sprays along cut direction (right→0°, left→180°)
- ☐ config-purity still zero literals in core/ (chaos-proof it again: plant a
  literal → red → remove → green)
Plus this kickoff's additions:
- ☐ ESLint green (or decision explicitly vetoed by Kheshav)
- ☐ Every new test watched failing first (TDD skill invoked at session start)
- ☐ `RESUME_HERE.md` + `docs/sessions/-SESSION-LOG.md` updated in the SAME
  commits as the work
- ☐ Browser boot verified in Chrome with zero console errors (screenshot or
  console output pasted)

## 5. Session discipline (unchanged, binding)

TDD skill first; chaos-test every guard; decide-and-flag with veto notes;
stop-rule: same root cause fails the gate 3× → one-line diagnosis before
continuing; commit per milestone (pre-commit gate must pass); no Stage 2 work
until this gate is 100% ☑. Per Kheshav's standing instruction in
MASTER_SPEC's header: goal is 1:1 — research contradictions instead of
trusting memory, and do not be a yes-man.
