# SESSION 5 KICKOFF — Stage 3 close (last Fable-window interactive session)

**Paste-prompt for the new session (one line):**
> Read `docs/sessions/SESSION5_KICKOFF.md` and execute it. Invoke the TDD
> skill before any code. Do not stop until the Stage-3 gate table is 100% ☑
> committed, or you are blocked on a decision only I can make.

Written 2026-07-12 at Stage-3-M1-landed. Suite 333/333 · tsc/eslint 0.
Standing mandates: `docs/sessions/SESSION4_KICKOFF.md` §0 (binding every
session — pushback · Duels-not-SHS · single-player-first · near-OG palette,
drawings/dialogue ALWAYS original · fight-first boot is a prototype).

## 0. FIRST ACTION — loop handshake (before ANY file edit)
The build loop may be running with the dead-man takeover live. Run:
`touch docs/loop/PAUSE; while [ -f docs/loop/CYCLE_RUNNING ]; do sleep 30; done`
The pre-commit hook re-touches PAUSE on every milestone commit, so commit
per milestone and the loop stays out of your way; if THIS session dies at a
usage limit, the loop takes over by itself ~2 h later and rides the quota
reset. That is the designed handoff — commit early, commit per milestone,
and death costs nothing.

## 1. Immediate work, in order
1. **Fresh-eyes adversarial review of the loop's M1 (`1c009e5`,
   `core/progression.ts` + `tests/progression.test.ts`).** It was verified
   green + chaos-proven and the Session-4 verdict was KEEP — but it has not
   had a hostile review. Attack: rebirth gold tier boundary (rank 9 vs 10),
   SP-cap interaction with rebirth resets, elemental record immutability,
   pool refill aliasing, missing scenario coverage. Anything confirmed →
   fix red-first. Do NOT rewrite what survives review.
2. **M2 — XP curve:** the video study already extracted thresholds
   (L1–L10 curve complete — Session-1 log 17:00; A-00 notes carry 550/663).
   Pull the real numbers from `docs/research/` segments into a pinned
   config (CONTRACT where frame-backed, INFERRED interpolations flagged) +
   `xpToLevel`/`levelForXp` in core, red-first. Wire the HUD XP bar's
   "0 / 550" to the real curve (render-only read).
3. **M3 — Chi meter + skill costs** (the Stage-2 deferral): Chi pool in
   Sim (fill/max INFERRED, pinned), skills 1/2/3 charge Chi on top of
   cooldowns, HUD Chi bar (B-23 anatomy). Chaos: cost > meter → denied +
   cooldown NOT consumed. Then RE-RUN the 24-seed harness — if any Sim
   surface moved, re-pin medians with a RED receipt.
4. **M4 — accrual + persistence seam:** kill → XP/coins accrue to the
   profile (KILL_REWARD stays INFERRED-labeled); profile math in core,
   localStorage strictly at the game/ boundary (config-purity + import
   guards will bite anything else — that's correct). DuelResult keeps
   +10/+8 display parity. Browser-verify with the dev-seam loop-step
   protocol: kill → values accrue → R-restart → values PERSIST → clears
   the queued gate item at the top of RESUME_HERE.
5. **Stage-3 gate table 100% ☑ in RESUME_HERE + commit = STAGE 3 CLOSED.**
   Update TELLS rows 29–32, CALIBRATION, DIVERGENCES in the same commits.
6. **Write STAGE4_KICKOFF.md at close** (campaign scope: title, dialogue,
   town, quests, RPG screens — all dialogue/names ORIGINAL per invariant;
   kickoff-bar polish + verdict).

## 2. Landmines carried forward
- **Fable-5 access was time-boxed through 2026-07-12** — this session is
  assumed to be the last on it. If the model errors at start, fall back to
  Opus 4.8 xhigh and say so.
- Loop cycles share the account quota — while THIS session runs, the loop
  idles on fresh PAUSE (no double burn).
- `REBIRTH.lateGold` is UNREACHABLE under MAX_DAN_RANK=10 (recorded in
  DIVERGENCES; don't "fix" it into reachability).
- Rebirth 10th-tier "+20 elemental" nuance deliberately NOT modeled
  (DIVERGENCES; veto = add `tenthElemental`).
- Elemental TREES are Stage 4/5 — Stage 3 stores points only.
- Quota-killed subagents = UNVERIFIED, never refuted (audit rule).
- Occluded-tab rAF stalls — browser measurements go through the
  `window.__game` loop-step protocol (session log 19:25 has the recipe).

## 3. Session discipline (unchanged, binding)
TDD skill first · chaos-test every guard · decide-and-flag with veto notes ·
per-milestone commits (pre-commit green — it also heartbeats the loop) ·
RESUME_HERE + session log updated in the SAME commit · ledgers updated as
rows change · kickoffs polished to the bar with the verdict reported.
