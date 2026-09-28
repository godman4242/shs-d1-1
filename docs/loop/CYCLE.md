# One loop cycle (SSHD 1:1): a senior engineer's routine

`scripts/build-loop.sh` starts a **fresh** headless `claude -p` for every cycle. Each one does
**exactly one cycle** below and exits. The shell does the looping, the time box, the watchdog and,
after every ship, the chaos gate and then the push. `docs/loop/GOAL.md` says what matters and its **hard rules win**
over anything here. This file is the routine.

**The bar is a senior engineer's, not a test runner's.** Reproduce before fixing, make the smallest
diff that fixes it, prove it green, then **look at it** and **try to break it**. Measure, never
infer: a number you did not see on screen this cycle does not go in a commit.

## One cycle: do exactly this, in order

1. **Ground.** Read `RESUME_HERE.md` (its top kickoff is the current front), the stage section of
   `docs/MASTER_SPEC.md` it names, and that kickoff in `docs/sessions/`.
2. **Pick ONE milestone:** the single most valuable step toward the current stage gate.
   **Re-verify the baseline first:** run the gates and compare to RESUME_HERE's "THE GATES, AS THEY
   STAND" block. If a number moved, that is the finding: record it, don't build on it.
3. **Red first.** Write the failing test and watch it fail **for the stated reason**. No red, no fix.
4. **Fix** with the smallest diff that turns it green, inside every invariant in `CLAUDE.md`.
   Every new config number is labelled CONTRACT or INFERRED and carries a `<File>.as:<line>` cite.
5. **Gate:** `npm run typecheck && npx vitest run && npm run lint && npm run claimcheck`. All green,
   with the totals on screen.
6. **LOOK**, for anything visual. Render it with the repo's render CLI (`scripts/art/poseRaster.ts`;
   its arguments are in `scripts/art/renderPoseArgs.ts`; it writes `renders/<variant>.png`). Then
   **open the image next to a reference frame** from `reference/frames/` with the Read tool. The
   frame wins. If it can't be judged headless (motion, feel, audio), queue it at the top of
   RESUME_HERE under "Awaiting human/browser verification". Never tick it.
7. **CHAOS** every new guard: declare its plant in `tests/*.plants.ts`, then run
   `npm run chaos -- <substring>` and watch the named test go RED and the file come back
   byte-identical. A plant that stays green is a missing test.
8. **Review, scaled to risk:**
   - tiny (docs, comments): your own hostile pass over `git diff`;
   - normal: ONE fresh-context reviewer subagent on `git diff` ("find a real bug in this diff; quote
     the line and the input that breaks it"). Re-verify its claims at the source before acting;
   - **high-risk** (closing a stage gate, touching an invariant or an owner ruling, anything hard to
     undo): **do not ship the change.** Commit ONLY `RESUME_HERE.md`, carrying the plan and evidence
     for an attended session, and end the cycle. The loop stashes whatever you leave uncommitted.
9. **Ship ONE commit.** In the SAME commit: `RESUME_HERE.md` (the gates block re-measured, and the
   paste-ready kickoff at the top pointing at the next step) and `docs/sessions/-SESSION-LOG.md`.
   Commit locally and **never push yourself**: the shell pushes, and only after step 10's check.
10. **Exit.** The shell runs `npm run chaos` (all plants). Green → it pushes. Red → the commit stays
    local and the loop STOPs until a human looks.

## No gap above the bar

If nothing toward the current gate clears the bar, make NO commit, print why, and exit. **An idle,
honest cycle beats a rushed one.**
