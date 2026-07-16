# GOAL — north star for autonomous build cycles (SSHD 1:1)

**One sentence:** ship the current MASTER_SPEC stage to a 100%-green binary
gate, in strict TDD, without ever violating the repo invariants.

**Project framing (owner, 2026-07-16 — never lose this):** the repo is an
EXPERIMENT — how far Fable 5 can push toward indistinguishable-in-motion
fidelity with the original — not a game for players (that comes later). The
metric is the MEASURED CEILING: every unprotectable property (color,
geometry, proportion, TIMING/MOTION) matched exactly; drawings and dialogue
stay original — the pixel-by-pixel-copy ask was held three times
(`docs/sessions/FIDELITY_V2_KICKOFF.md` Standing Rulings §1; never
relitigate it in a cycle).

**Current front:** `docs/sessions/SESSION8_MOTION_KICKOFF.md` — motion
(walk cycle, strike arcs, death collapse — the owner's sliding-sprite
feedback) + measured proportions. Storyline is Stage-4 M1+ (ORIGINAL
script), after motion.

## Priority order (higher wins on conflict)

1. **Correctness** — tests green, gates honest, no evidence faked.
2. **1:1 fidelity** — MASTER_SPEC + `docs/research/video-study/SYNTHESIS.md`
   are the contract; research beats memory; errata block beats spec prose.
3. **Feel** — SYNTHESIS §4 feel notes (hard cuts, arcade-fast trash combat).
4. **Performance / polish** — only inside the current stage's scope.

## Hard rules (a cycle that breaks one must abort with a report, not commit)

- Read `RESUME_HERE.md` + the current stage section of `docs/MASTER_SPEC.md`
  + the stage kickoff in `docs/sessions/` BEFORE any code.
- TDD: every new behaviour's test is watched RED first. Chaos-test guards.
- NEVER advance to the next stage while the current gate has an unchecked box.
- Gate items needing a real browser or human judgment CANNOT be checked from
  a headless cycle: leave them unchecked, queue them at the top of
  RESUME_HERE.md under "Awaiting human/browser verification".
- Invariants (root CLAUDE.md): RECREATE-NEVER-RIP (drawings/dialogue always
  original) · palette sits at near-OG hues — owner veto 2026-07-12, NEVER
  re-shift it · core/ zero literals · dependency direction · render-only
  scenes · commit = pre-commit gate green.
- Update RESUME_HERE.md + docs/sessions/-SESSION-LOG.md in the SAME commit.
- END OF EVERY SESSION/CYCLE-RUN (owner standing rule, 2026-07-16): write
  the NEXT session's kickoff in `docs/sessions/` — copy-paste ready,
  polished, with an explicit self-report of whether it reaches the
  "can't-get-better" bar — and point RESUME_HERE at it.
- No gap above the bar → NO commit (a no-op beats a rushed one). Print why.

## Re-steering

Edit this file; the next cycle obeys it.
- `docs/loop/PAUSE` = SOFT pause with a dead-man switch: interactive sessions
  create it and the pre-commit hook re-touches it every milestone commit. If
  it goes stale (>2 h) while the tree is quiet (>1 h), the loop presumes the
  session died (usage-limit cut / crash) and TAKES OVER by itself — cycles
  ride quota outages via geometric backoff until the reset.
- `docs/loop/STOP` = HARD pause, never auto-removed. Use for deliberate
  breaks (hand-editing, holidays).
- Returning to interactive work: `touch docs/loop/PAUSE`, then wait until
  `docs/loop/CYCLE_RUNNING` disappears before editing.
