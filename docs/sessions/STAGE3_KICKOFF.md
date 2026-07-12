# STAGE 3 KICKOFF — Progression (written at Stage-2 close, 2026-07-12)

**Paste-prompt for the executing session (one line):**
> Read `docs/sessions/STAGE3_KICKOFF.md` and execute it. Invoke the TDD skill
> before any code. Do not stop until the Stage-3 gate table is 100% ☑
> committed, or you are blocked on a decision only Kheshav can make.

State at writing: Stage 2 CLOSED 100% ☑ (`RESUME_HERE.md` gate table) ·
suite 305/305 · tsc/eslint 0 · M1–M10 on `master`. Standing mandates §0 of
`docs/sessions/SESSION4_KICKOFF.md` remain binding (pushback · Duels-not-SHS ·
single-player-first · near-OG palette, drawings/dialogue always original ·
fight-first boot is a prototype).

## 1. Scope (MASTER_SPEC Stage 3, ERRATA WINS) — binary-done
Spec text says: `progression.ts` (levelUp +1 SP / +3 stat / full refill,
rebirth, 80 SP first-run cap), expanded `economy.ts`, `progression.test.ts`.
**Errata overrides (already owner-defaulted):**
- `MAX_DAN_RANK = 10`, NOT the spec's 5 (decision #2; spec's own `tenthGold`
  corroborates). The gate item "Dan rank 5 is max" reads "Dan rank
  MAX_DAN_RANK is max".
- Rebirth = **+10 chosen ELEMENTAL skill points, stacking** (decision #3;
  video A-17 Rebirth Scroll), not "+10 Attack". Payout schedule from the
  REBIRTH pins (early 25g / tenth 100g / late 25g).
- `KILL_REWARD` stays INFERRED — 20+ video samples show NO flat formula
  (SYNTHESIS §1.2); keep the label honest.

## 2. Work order
1. **core/progression.ts, red-first:** levelUp math (+1 SP, +3 stat, full
   HP/Chi/AP refill — exact-value pins), FIRST_RUN_SP_CAP=80 enforcement,
   dan-rank ladder to MAX_DAN_RANK=10, rebirth (elemental +10 stacking +
   gold payout). Zero literals; every number lands in config with
   double-entry pins. Chaos: over-cap SP grant, rebirth at non-max rank,
   NaN/negative XP inputs.
2. **XP curve research BEFORE inventing one:** check
   `docs/research/original-game-facts.md` + wikis for level thresholds (the
   HUD's "0 / 550" B-23 reading is a single sample, not a curve). If research
   is dry: INFERRED curve, flagged, single config site.
3. **Chi meter + skill costs (the Stage-2 deferral):** Chi in Sim (fills/max
   in config, INFERRED), skills 1/2/3 gain Chi costs alongside cooldowns,
   HUD Chi bar (B-23 anatomy). Chaos: cost > meter → denied, no cooldown
   consumed.
4. **Accrual + persistence seam:** kill → XP/coins accrue to a player
   profile; core stays pure (profile math in core, storage at the game/
   boundary — localStorage, DEV-clearable). DuelResult keeps display parity
   (+10/+8 at foe level 1).
5. **Gate table in RESUME_HERE.md** (same format as Stages 1–2) → commit =
   STAGE 3 CLOSED. Update `docs/TELLS_CHECKLIST.md` rows 29–32 +
   `docs/DIVERGENCES.md`/`docs/CALIBRATION.md` as values land.

## 3. Gate (from spec, errata-read; all must pass)
☐ progression unit tests green (suite stays green throughout)
☐ Level-up: exactly +1 SP, +3 stat, full HP/Chi/AP refill
☐ Rebirth: +10 elemental, stacks N times (property test over N)
☐ 80 SP first-run cap enforced
☐ Dan rank MAX_DAN_RANK(=10) is max
☐ Two currencies (Coins grindable, Gold earnable), HAS_CASH_PURCHASE=false
☐ Browser: kill a foe → XP/coins visibly accrue and persist across R-restart

## 4. Landmines
- Chi costs must NOT break the M7 harness (the bot uses skills? — it
  doesn't, but re-run and re-pin the 24-seed medians if any Sim surface
  moved; refresh = RED receipt).
- `economy.ts` pins are exact-8 style (coins=8 NOT 5 — verified value;
  iaido-duel showed +5, ours is the verified figure, keep 8).
- Don't invent spec-unnamed constants (config/CLAUDE.md); the XP curve gets
  ONE named config site if INFERRED.
- Elemental skill TREES are Stage 4/5 scope — Stage 3 stores the points and
  the chosen element only (flag the seam, don't build the tree).
- Persistence must not leak into core/ (no localStorage/window in core —
  config-purity + import guards will bite; that's correct).

## 5. Discipline (unchanged, binding)
TDD skill first · chaos-test every guard · decide-and-flag with veto notes ·
per-milestone commits (pre-commit green) · RESUME_HERE + session log in the
SAME commit · ledgers updated as rows change · browser verification via the
dev-seam loop-step protocol (`window.__game`; occluded tabs stall rAF —
step manually).
