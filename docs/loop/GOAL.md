# GOAL — north star for autonomous build cycles (SSHD 1:1)

**One sentence:** ship the current MASTER_SPEC stage to a 100%-green binary
gate, in strict TDD, without ever violating the repo invariants.

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
- Invariants (root CLAUDE.md): RECREATE-NEVER-RIP · palette stays
  trade-dress-shifted · core/ zero literals · dependency direction ·
  render-only scenes · commit = pre-commit gate green.
- Update RESUME_HERE.md + docs/sessions/-SESSION-LOG.md in the SAME commit.
- No gap above the bar → NO commit (a no-op beats a rushed one). Print why.

## Re-steering

Edit this file; the next cycle obeys it. Pause safely with
`touch docs/loop/PAUSE`; resume with `rm docs/loop/PAUSE`.
