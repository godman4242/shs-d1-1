# SESSION 4 KICKOFF — Stage-2 closeout → Stage 3 (paste-companion)

**Paste-prompt for the new session (one line):**
> Read `docs/sessions/SESSION4_KICKOFF.md` and execute it. Invoke the TDD
> skill before any code. Do not stop until the Stage-2 gate table is 100% ☑
> committed, or you are blocked on a decision only I can make.

Written 2026-07-12 at Stage-2-nearly-closed, whole codebase in context.
Suite 297/297 · tsc/eslint 0 · audit findings all fixed (commit history:
M1–M9 on `master`).

## 0. Standing mandates (Kheshav, 2026-07-12 — binding every session)
1. **Pushback mandate:** evaluate every instruction as the senior engineer;
   stop bad choices — always WITH a better alternative. Never yes-man.
2. **Target game = Straw Hat Samurai: DUELS** (Explosive Barrel, v0.717) —
   NOT the prequel "Straw Hat Samurai". Different games. When researching,
   never mix sources.
3. **Single-player first.** Duels was multiplayer; we build a fully
   functional single-player game before ANY multiplayer work.
4. **Maximum closeness, one hard line:** palette = near-OG (owner vetoed the
   trade-dress shift — never re-shift); mechanics exact; structure iterated
   hard against `reference/frames/`; plot/characters/beats 1:1. The line:
   drawings and dialogue are ALWAYS original work — no tracing, no verbatim
   script. Kheshav accepted this scope explicitly.
5. **Story flow expectation:** today's fight-first boot is a PROTOTYPE
   (fine). The eventual shape follows the original: login/menu → story
   intro → world → fights (Stage 4/5). Say so whenever he asks.

## 1. Immediate work, in order
1. **FX clock fix** (audit-verified, deferred): DuelScene FX ignore
   `sim.timeScale` — droplets integrate raw `delta`, trails/redStrokes age
   on raw `time.now`, so slow-mo runs gameplay at 0.35× while blood/trails
   run 1×. Add a scene `fxNow += delta × ts` clock for FX aging/integration;
   KEEP kill-beat timing + invuln blink on wall clock (cinematic hold must
   stay ~0.9 s real). Browser-verify during Shunpo.
2. **Stage-2 gate table:** assemble the full VERIFICATION GATE checklist in
   `RESUME_HERE.md` with evidence pointers (session log has everything:
   297/297, determinism 3-process, harness median 26.04 s, browser
   screenshots, chaos proofs). Commit = STAGE 2 CLOSED.
3. **Mine `~/kheshav-code/iaido-duel`** (his earlier Opus-4.8 attempt at the
   same game): read `CALIBRATION.md`, `DIVERGENCES.md`, `TELLS_CHECKLIST.md`,
   `RESUME_HERE.md`, `docs/`. Import anything better than ours (fidelity
   tells checklists, calibration workflow, divergence log format) — improve,
   don't copy blindly. Log what was adopted/rejected and why.
4. **Upgrade `~/kheshav-code/agent-work-ethic`** (his cross-project working
   rules repo): distill what made this Fable-5 session work into rules Opus
   4.8 can follow — the ones that carried the most value here:
   binary stage gates + evidence-pasted sign-offs · red-first TDD with
   chaos-proofs (plant→red→restore→green) · double-entry config pins ·
   ratchet baselines with RED-receipt refreshes · decide-and-flag with veto
   notes · adversarial audit workflows (find→2-refuter verify; treat
   quota-killed verifies as UNVERIFIED, never refuted) · browser
   verification with the dev-seam loop-step protocol · per-milestone
   commits with handoff docs in the same commit.
5. **Then Stage 3** (progression) per `docs/MASTER_SPEC.md` + errata
   (MAX_DAN_RANK=10, elemental rebirth — open decisions #2/#3 defaults).

## 2. Landmines carried forward
- 15 audit verifier agents died on quota (6 pm KL reset); every finding was
  re-verified INLINE and fixed — nothing pending from the audit.
- Subagent quota walls recur: launch big workflows right after resets;
  always treat quota-killed agents as UNVERIFIED (a `{confirmed:[]}` result
  can be an artifact — check the failures list + journal first).
- Phaser clock jumps on occluded tabs: intro re-anchors (fixed); any new
  time-based scene logic needs the same treatment.
- `AI_APPROACH_RANGE` is documented as Stage-4 world-aggro only.
- Chi meter/costs are Stage-3 scope (skills are cooldown-gated now).

## 3. Session discipline (unchanged, binding)
TDD skill first · chaos-test every guard · decide-and-flag with veto notes ·
per-milestone commits (pre-commit gate green) · `RESUME_HERE.md` + session
log updated in the SAME commit · kickoffs polished to the "cannot be
improved" bar and the verdict reported explicitly.
