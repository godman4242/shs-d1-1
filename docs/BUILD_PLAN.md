<!--
ADOPTION NOTE (2026-07-17 late, Session 8B close) — read before trusting.

Origin: compiled 2026-07-17 by a parallel Claude session ("Clawdia") from
this repo's own docs, AFTER the Session 8B close commits (its git-history
and state tables were verified accurate at adoption). Adopted from
~/Downloads on Kheshav's request.

Role and precedence: this is the ORIENTATION MAP — the one-page picture
for a fresh session or a fresh model. It is NOT a live ledger. On any
conflict: RESUME_HERE.md (current state) > the active session kickoff >
CLAUDE.md + MASTER_SPEC (rules/spec) > this plan. Its "Current State"
section is a snapshot of 2026-07-17 and is expected to go stale — do not
update it per-session; RESUME_HERE carries the live state.

§2 "Model Recommendation" is NOT project policy: this repo is a Fable-5
fidelity EXPERIMENT (owner framing 2026-07-16) — running build sessions
on third-party models would contaminate the experiment's metric, and
§2's model claims are unverified research. Fallback routing stays the
owner's global rule (Opus 4.8), decided by the owner, not this doc.

Verified at adoption: HEAD f8fe943 · suite 444/444 · gate 55/55 ·
36 tells confirmed (checklist reaches ☐ 36). "43 source files" is
approximate (51 .ts under src/ by plain count).
-->

# BUILD PLAN — Straw Hat Samurai: Duels 1:1 Recreation

> **Purpose:** Give Fable 5 (or any agentic coding model) everything it needs to build this game in one place — tech stack, architecture, current state, build stages, acceptance criteria, invariants, and pointers to the full reference docs. Pair this with `SHSD-MASTER-REFERENCE.md` (the research bible).
>
> **Generated:** 2026-07-17 by Clawdia
> **Project root:** `/Users/kheshav/kheshav-code/SSHD 1-1/`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Model Recommendation](#2-model-recommendation)
3. [Tech Stack (Fixed)](#3-tech-stack-fixed)
4. [Architecture & File Structure](#4-architecture--file-structure)
5. [Invariants (Non-Negotiable Rules)](#5-invariants-non-negotiable-rules)
6. [Current State (What's Done)](#6-current-state-whats-done)
7. [Remaining Build Stages](#7-remaining-build-stages)
8. [Session Discipline](#8-session-discipline)
9. [Open Decisions](#9-open-decisions)
10. [Key Reference Files](#10-key-reference-files)
11. [Build Order Summary](#11-build-order-summary)

---

## 1. Project Overview

**Goal:** From-scratch, original-asset recreation of the Flash game *Straw Hat Samurai: Duels* (LutGames / Explosive Barrel, died with Flash January 2021). 1:1 feel — indistinguishable-in-motion from the original.

**Owner framing (2026-07-16):** The repo is an **experiment** — how far an agentic AI can push toward indistinguishable-in-motion fidelity. The metric is the **measured ceiling**: every unprotectable property (color, geometry, proportion, TIMING/MOTION) matched exactly; drawings and dialogue stay original work.

**Key constraint:** RECREATE, NEVER RIP. No decompiled code, no extracted art, no ripped audio. Everything is drawn/synthesized from scratch. Reference videos are study-only, gitignored, never distributed.

---

## 2. Model Recommendation

### What you're using now: Fable 5 (Claude)

Fable 5 / Claude Opus 4.8 is the **top pick for agentic coding** in 2026 — leads SWE-bench Verified, handles large refactors with fewer broken edits, strong on long agent loops. This is the right tool for the job.

### Ollama Cloud Alternatives (if Claude access is limited)

If Fable 5 hits usage caps (which it has been), these are the best coding models available on Ollama Cloud as of July 2026, ranked for this specific project:

| Model | Ollama Name | Why It Fits This Project |
|---|---|---|
| **Kimi K2.7 Code** | `kimi-k2.7-code` | Specifically tuned for coding; latest Kimi variant (June 2026). Built for long autonomous runs and multi-agent swarms — matches our autonomous build-loop pattern. |
| **GLM-5.2** | `glm-5.2` | Best open-weight coder (June 2026). First open-weight model to beat GPT-5.5 on SWE-bench Pro. 1M-token context window — can hold the entire codebase + reference doc in one context. |
| **DeepSeek V4-Pro** | `deepseek-v4-pro` | Leads LiveCodeBench and Codeforces. Strong on competitive-programming-style problems and algorithm-heavy code (combat math, physics, animation curves). |
| **Qwen 3.5** | `qwen3.5:397b` | Replacement for the retired qwen3-coder. 397B params, strong coding benchmarks. |
| **DeepSeek V4 Flash** | `deepseek-v4-flash` | Faster, cheaper DeepSeek variant — good for high-volume agent loop iterations. |

### My recommendation for this project

1. **Primary: Claude Fable 5** — stay on it when quota allows. It's the best agentic coder and the project is already structured around its workflow (CLAUDE.md, session kickoffs, build-loop).
2. **Fallback: `kimi-k2.7-code`** on Ollama Cloud — when Claude quota runs out, this is the closest match for long autonomous coding sessions. Run it via `ollama run kimi-k2.7-code` and feed it the same CLAUDE.md + BUILD_PLAN + SHSD-MASTER-REFERENCE context.
3. **For research/measurement subagents: `glm-5.2`** — the 1M-token context is ideal for frame analysis and reference doc work where you need to hold many images/frames in context.

**Note:** The project's STAGE4_KICKOFF already says "Fable-5 window closed 2026-07-12 — re-check model access at session start; fall back to Opus 4.8 xhigh and say so." This build plan extends that: if Opus is also capped, fall back to `kimi-k2.7-code` on Ollama Cloud.

---

## 3. Tech Stack (Fixed — Not Negotiable)

| Component | Version | Notes |
|---|---|---|
| **Game engine** | Phaser 3 (pinned `phaser@3`, NOT v4) | 3.90.0 currently |
| **Language** | TypeScript 5 | 5.9.3 currently |
| **Bundler** | Vite | 8.1.4 currently |
| **Test framework** | Vitest | 4.1.10 currently, TDD mandatory |
| **Linting** | ESLint 9 + typescript-eslint 8 | Strict type-checked |
| **Audio** | WebAudio API only | Synthesized SFX, no audio files |
| **Art** | Procedural vector only | Drawn in code, no image files |
| **Sim** | Fixed 60Hz timestep | Injected mulberry32 RNG, no `Math.random` in core/ |

### Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run typecheck    # tsc --noEmit (both tsconfigs)
npm test             # vitest run
npm run test:watch   # vitest watch mode
```

### Quality Gate

- Pre-commit runs typecheck → tests (`.githooks/pre-commit`)
- Commit = green (typecheck + tests + eslint all pass)

---

## 4. Architecture & File Structure

### Dependency Direction (Enforced)

```
src/config/  ← imports nothing outside itself
src/core/    ← imports config/ only
src/game/    ← imports core/ + config/
```

Never reverse. Enforced by tests.

### Directory Layout

```
src/
├── config/          # ALL gameplay numbers (labeled CONTRACT or INFERRED)
│   ├── ai.ts        # AI tier parameters, ranges, speeds
│   ├── anim.ts      # Animation constants (poseStepMs, idlePeriodMs, etc.)
│   ├── chi.ts       # Chi meter costs, regen rates
│   ├── combat.ts    # Damage constants, crit mult, slash/blade/blood params
│   ├── combat-sim.ts # Sim constants (speeds, distances, fighter bases)
│   ├── display.ts   # HUD layout, display constants
│   ├── duel.ts      # Duel spawn positions, arena dimensions
│   ├── economy.ts   # Kill rewards, level-up rewards, rebirth, war room
│   ├── fidelity.ts  # Fidelity gate probe definitions
│   ├── fx.ts        # Slash arc, blood FX, finisher flash constants
│   ├── gesture.ts   # Gesture classification thresholds
│   ├── nums.ts      # Shared numeric constants
│   ├── palette.ts   # COL object — all hex colors
│   ├── poses.ts     # 15-joint pose keyframes (IDLE, WINDUP, GUARD, etc.)
│   ├── profile.ts   # Profile pool defaults
│   ├── rng.ts       # Mulberry32 seed
│   ├── skills.ts    # Skill definitions, cooldowns, costs
│   ├── stances.ts   # STANCE_TABLE, STANCE_BEATS, mastery
│   ├── timing.ts    # FIXED_HZ, SLASH_FRAMES, pose timing
│   └── xp.ts        # XP curve, level caps
├── core/            # Pure framework-free combat math (ZERO numeric literals)
│   ├── AISeamController.ts  # Enemy AI state machine
│   ├── DrawnStroke.ts      # Stroke capture + gesture classification
│   ├── OpponentController.ts
│   ├── Sim.ts              # Fixed 60Hz deterministic tick — owns ALL game state
│   ├── anim.ts             # Easing functions, lerp, animation math
│   ├── combo.ts            # Combo counter logic
│   ├── critical.ts         # Focus + Critical meters
│   ├── damage.ts           # Single damage formula site
│   ├── fidelityCompare.ts  # Fidelity gate comparison
│   ├── fighterAnimator.ts  # 15-joint skeletal animation
│   ├── fx.ts               # Blood/spark particle integration
│   ├── geometry.ts          # Point-in-polygon, line intersection, polyline
│   ├── gesture.ts           # Gesture classification
│   ├── profile.ts           # Profile/save state
│   ├── progression.ts       # Level-up, rebirth, XP, stat points
│   ├── projectile.ts        # Kunai entity + hit resolution
│   ├── rng.ts               # Mulberry32 implementation
│   ├── skeleton.ts          # 15-joint skeleton system
│   ├── slash.ts             # resolveSlash — damage resolution
│   ├── stance.ts            # Stance enum + counter triangle
│   ├── time.ts              # msToFrames (single conversion site)
│   ├── trajectory.ts        # Jump arc (pure parabola)
│   └── vec.ts               # 2D vector math
├── game/            # Phaser scenes (render-only, never own gameplay state)
│   ├── DuelIntro.ts         # VS → FIGHT! intro sequence
│   ├── DuelResult.ts        # Win/Defeat cards
│   ├── DuelScene.ts         # Main combat scene (boot scene for now)
│   ├── banners.ts           # Brush-stroke banner rendering
│   ├── fidelity.ts         # Fidelity gate runner
│   ├── profileStore.ts     # localStorage persistence
│   ├── samurai.ts           # Fighter rendering (kasa, katana, scarf, body)
│   └── main.ts              # Entry point, scene routing
└── (tests in /tests/)
```

### Key Architecture Rules

1. **`src/core/` has ZERO numeric literals** — enforced by `tests/config-purity.test.ts`. Every gameplay number lives in `src/config/`.
2. **Phaser scenes are render-only** — they never own gameplay state. `Sim` (fixed 60Hz, injected mulberry32 RNG) owns everything.
3. **No `Math.random` in core/** — use injected mulberry32 RNG only.
4. **config-purity ratchet on game/** — `tests/game-purity-ratchet.test.ts` fails on new/substituted numeric values.

---

## 5. Invariants (Non-Negotiable Rules)

### Root Invariants

| # | Invariant | Enforcement |
|---|---|---|
| 1 | **RECREATE, NEVER RIP** — No decompiled code, no extracted art, no ripped audio. Drawings/dialogue always original. | Manual + review |
| 2 | **Palette policy** — Hues sit at best reading of original's look. Owner vetoed the ±5-8% trade-dress shift (2026-07-12). Never re-shift. | `config/palette.ts` |
| 3 | **Stack is fixed** — Phaser 3 (NOT v4) + TypeScript 5 + Vite + Vitest + WebAudio + procedural vector only. | `package.json` |
| 4 | **Dependency direction** — game/ → core/ + config/; core/ → config/ only; config/ → nothing. Never reverse. | `tests/no-game-imports.test.ts` |
| 5 | **core/ zero literals** — No numeric literals in `src/core/`. | `tests/config-purity.test.ts` |
| 6 | **Render-only scenes** — Phaser scenes never own gameplay state; Sim owns everything. | Manual |
| 7 | **Fixed 60Hz timestep** — Sim advances at fixed 60Hz, injected RNG, no Math.random in core. | `core/Sim.ts` |
| 8 | **Binary stage gates** — Don't advance to next stage until current gate is 100% green. | RESUME_HERE.md gate tables |
| 9 | **Chaos-test every guard** — Plant the failure, watch red, fix, watch green. | Tests |
| 10 | **Pixel-copy DECLINED** (three times) — The measured ceiling is the target, not pixel-by-pixel copying. | FIDELITY_V2_KICKOFF §1 |

### Campaign-Specific Invariants (Stage 4+)

| # | Invariant |
|---|---|
| 11 | **All names, story, and dialogue are INVENTED** — Nothing transcribed from the original game, wikis, or videos. Structure and mechanics (unprotectable) can be 1:1. |
| 12 | **Name/story bible** (`docs/campaign/BIBLE.md`) is the single source — every milestone pulls names from it. |
| 13 | **HAS_CASH_PURCHASE = false** — Shop sells for coins/gold only, ever. |

---

## 6. Current State (What's Done)

### Summary

| Stage | Status | Tests | Key Deliverables |
|---|---|---|---|
| **Stage 0 — Scaffold** | ✅ CLOSED | 155/155 | Project boots, Vite+Phaser+TS+Vitest, config-purity enforced |
| **Stage 1 — Slash Engine** | ✅ CLOSED | 155/155 | vec, geometry, DrawnStroke, slash, stance, gesture, DuelScene with forest + fighter + blade trail + blood |
| **Stage 2 — Full Combat** | ✅ CLOSED | 305/305 | Sim (deterministic 60Hz), AI controller, critical/combo/projectile/trajectory, all combat mechanics, VS→FIGHT! intro, Victory/Defeat, 24-seed harness |
| **Stage 3 — Progression** | ✅ CLOSED | 377/377 → 444/444 | Level-up (+1 SP/+3 stat/full refill), rebirth (+10 elemental, stacking), 80 SP cap, dan rank 10 max, two currencies, persistence (browser-verified) |
| **Stage 4 — Campaign** | 🔄 M0 DONE, M1-M7 PENDING | — | Skeletal fighters ported (15-joint system), walk cycle live. Title/dialogue/town/quests/RPG screens NOT started. |
| **Fidelity Gate** | ✅ 55/55 PASS | — | 5 states × 41 point probes + 14 edge scans. HUD colors, VS intro, result cards all measured-faithful. |
| **Session 8 — Motion** | ✅ CLOSED | 444/444 | Distance-driven stride (no foot-skating), 15fps pose latch, measured walk numbers, hit stagger timing, death animation |
| **Session 8B — Motion cont.** | ✅ CLOSED | 444/444 | Semi-crouch IDLE_POSE applied, walk amplitudes tightened (bob 3→1, armSwing 7→0), SLASH_FRAMES measured (4f windup + 4f active constant, recovery 4/8/12 per stance) |
| **Session 9 — Motion pt 3** | ⏳ NOT STARTED | — | Dash-through slash (signature move gap), deeper crouch, owner feel-run |

### Source File Count

- **43 source files** (non-test) across `src/config/`, `src/core/`, `src/game/`
- **30 test files** in `tests/`
- **444 tests** passing
- `tsc` ×2 configs exit 0, eslint exit 0

### Git History (last 5 commits)

```
f8fe943 Session 8B CLOSE: log + SESSION9 kickoff + RESUME_HERE routing
2c01a31 Session 8B slice 3b: viewer results applied — bob 1, armSwing 0, breath halved
f89c1cd Session 8B slice 3a log: semi-crouch applied, gate 55/55 re-proven, composite verdict B+
530ec62 Adopt SHSD_MASTER_REFERENCE.md — compiled research digest (owner request)
22be5de Session 8B slice 3a: semi-crouch combat IDLE_POSE applied (MEASURED)
```

---

## 7. Remaining Build Stages

### Stage 4 — Campaign (CURRENT FRONT)

**Status:** M0 (skeletal fighters) done. M1-M7 pending.

**Entry point:** `docs/sessions/STAGE4_KICKOFF.md`

**Session 9 (motion pt 3) runs FIRST** — `docs/sessions/SESSION9_KICKOFF.md` — then Stage 4 M1+.

#### Session 9: Motion Part 3 (dash-through slash + crouch depth)

| # | Task | Verify |
|---|---|---|
| 1 | Owner feel-run (human eyes) | Log verdict line |
| 2 | Dash-through slash in Sim (signature move — attacker translates in ONE frame ~125 stage px, red streak renders AFTER arrival) | Red-first Sim tests + chaos-proven arena clamp |
| 3 | Dash render = 1-frame snap, streak after arrival | Browser zoom pair + gate 55/55 |
| 4 | Deepen combat crouch (within measured ratios — knee-bend ~157°, height ~117 stage px are hard pins) | Composite re-delivered + verdict |
| 5 | Suite · tsc ×2 · eslint · 55/55 · zero fresh-load console errors | Pastes |
| 6 | Ledgers + RESUME_HERE + SESSION10 kickoff in closing commit | `git show --stat` |

#### Stage 4 Milestones

| Milestone | Description | Key Details |
|---|---|---|
| **M0** ✅ | Skeletal fighters (port from iaido-duel) | 15-joint skeleton, FighterAnimator, walk cycle live |
| **M1** | Boot flow + title screen | Retire fight-first prototype boot. Title screen (brush-stroke logo, red-on-parchment, ORIGINAL mark). Menu → town. `?scene=duel` becomes a real route. Loading screen with rotating tip line. Guest start seeds 100 coins / 3 gold HERE. |
| **M2** | Name/story bible + dialogue system | `docs/campaign/BIBLE.md` — invent 3 clans, ~8 characters, town/region names, invasion premise. Dialogue engine: gold-cornered parchment frames, white serif caps, click-to-advance, choice buttons. Dialogue data in `src/config/campaign/`. |
| **M3** | Town scene + NPCs | Walk-around (A/D + interact key), procedural vector town built FROM study frames, NPCs with talk triggers → dialogue → quest offers. Overworld HUD shows HP/CHI only (AP is menu-only). |
| **M4** | Quest system | Accept → journal → objective flags → FINISH/ABANDON → reward (XP/coins via Stage-3 accrual seam). B-23 QUESTS panel anatomy: tabs, expiry line, reward block, TAKE-ME-THERE with travel cost. Persistence: quest flags join the profile save. |
| **M5** | RPG screens | Character sheet (HP/CHI/AP pools, ATK/DEF/SPD, stat-point spending, level-up modal, level cap 80 UI clamp), equipment + inventory (9-slot paperdoll, "(EQ: n)" compare, rarity borders, weight stat), skills screen, rebirth scroll UI (1,000 coins, L80 gate, element pick). |
| **M6** | Structure | Season > Prologue/Episode nesting, 3-line haiku cards between episodes (ORIGINAL haiku), Prologue = tutorial (tutorial-master teaches slash/jump/stance through dialogue + gated first duel). |
| **M7** | Gate close | Stage-4 gate table 100% ☑ in RESUME_HERE, TELLS rows 29-31, STAGE5_KICKOFF.md written. |

**Stage 4 Gate Table:**

| Gate Item | How to Prove |
|---|---|
| Title screen renders, brush-stroke aesthetic | Browser screenshot, zero console errors |
| Dialogue in gold-cornered parchment frames | Browser screenshot + unit tests on dialogue engine state machine |
| Town: walk around, talk to NPCs, accept quests | Browser run via loop-step protocol |
| Quest tracking accept→objective→complete→reward | Unit tests on quest state machine + browser run; reward accrues through Stage-3 seam and PERSISTS |
| Character sheet shows stats, equipment, skills | Browser screenshot; stat spend red-first unit tests |
| Haiku cards between episodes (3 lines, brush style) | Browser screenshot; content provably from the bible |
| Season > Episode nesting functional | Unit tests on campaign progression state + browser run |
| Prologue serves as tutorial | Browser playthrough of the full prologue |

**Stage 4 Landmines:**

- **All campaign text ORIGINAL** — M2 bible is the single source; review every milestone's strings against it before commit.
- **Stat-point effects are CONTRADICTORY on film** — CHI +5/pt solid; HP +10/pt single sample; ATK/DEF observed +3/pt in A-14 but +1/pt in A-21, SPD +3 both. Default: CHI +5, HP +10, ATK/DEF/SPD +1/+1/+3 (A-21 reading is later-game and cleaner), all INFERRED-labeled.
- **SP cap must track TOTAL-EARNED once spending exists** — clamping unspent breaks at M5.
- **Rebirth keeps grown pool maxes** — resolve alongside M5 (default: reset maxes to base on rebirth, INFERRED).
- **Level cap 80** — core stays uncapped; UI clamps at 80 (Rebirth Scroll gate, A-17). `levelForXp` keeps working past 80.
- **Browser protocol:** Phaser 3 listens for MOUSE events — synthetic PointerEvents are silently ignored. Occluded tabs freeze rAF → drive `game.loop.step` manually via `window.__game`.
- **PvE trash resolves 3-10s** — town-adjacent fights are NOT the 20-60s boss band; a trash-tier AI config lands with the first overworld encounter.
- **War Room, territory map, clan AI = Stage 5.** Elemental trees = Stage 5. Do not drift.

---

### Stage 5 — War Room (After Stage 4)

| # | Produce |
|---|---|
| 1 | Territory map (sectors, borders, ownership colors) |
| 2 | Rival-clan strategic AI (greedy: reinforce weakest border, attack adjacent weaker enemy, build when Captain+ and flush) |
| 3 | Deploy troops (+60/+100/75), flag bonus +120%, level-10 gate |
| 4 | Kill cap 350, build cap 500 |
| 5 | Elemental skill trees (Fire / Water / Earth / Wind — per-stance mastery trees, 10 levels each) |

**Gate:**

| Item | Verify |
|---|---|
| Territory map renders with correct ownership colors | Browser screenshot |
| AI moves per greedy strategy (reinforce, attack, build) | Unit tests + browser run |
| Kill cap 350 enforced | Unit test |
| Build cap 500 enforced | Unit test |
| Level-10 gate blocks access below level 10 | Unit test |
| Deploy values: +60/+100/75, flag +120% (exact) | Unit tests |

---

### Stage 6 — Polish (After Stage 5)

| # | Produce |
|---|---|
| 1 | Four-way slash SFX: draw (slashStarted), whiff (missed), flesh (hitLanded), armor (blocked). Synthesized via WebAudio. |
| 2 | Menu/exploring music separate from combat bed |
| 3 | Victory + defeat stings |
| 4 | Heavy-vs-light tone difference in slash SFX |
| 5 | Feel tuning pass: slash weight, duel pacing, slow-mo ramp |
| 6 | Difficulty curves per AI tier |
| 7 | Background density (foliage layers, atmospheric depth) |
| 8 | Brush display font for titles/haiku |

**Gate (human pass required):**

| Item | Verify |
|---|---|
| Four SFX fire on correct frames (draw/whiff/flesh/armor) | Browser audio check |
| Heavy slash sounds different from light slash | A/B comparison |
| Menu music ≠ combat music | Browser check |
| Victory sting ≠ defeat sting | Browser check |
| Slash feels weighty and satisfying | Human judgment |
| Duel pacing 20-60s on Normal | Human judgment |
| Slow-mo kill beat feels cinematic | Human judgment |
| Backgrounds feel dense and atmospheric | Human judgment |

---

## 8. Session Discipline

### Per-Session Rules

1. **Read first:** `RESUME_HERE.md` → current stage section of `docs/MASTER_SPEC.md` → current session kickoff in `docs/sessions/`.
2. **TDD:** Every new behaviour's test is watched RED first. Chaos-test guards (plant failure → red → fix → green).
3. **Commit per milestone** — pre-commit hook heartbeats the loop. If session dies, loop takes over ~2h later.
4. **Update `RESUME_HERE.md` + `docs/sessions/-SESSION-LOG.md` in the SAME commit** as the change it describes.
5. **End of every session:** Write the NEXT session's kickoff in `docs/sessions/` — copy-paste ready, polished, with self-report.
6. **Fidelity gate:** `npm run dev` → console → `await __fidelity.run()` → must stay 55/55 PASS. Re-run after HUD changes.

### Crash Insurance

- `scripts/build-loop.sh` + `docs/loop/GOAL.md` exist as crash insurance.
- `docs/loop/PAUSE` = soft pause with dead-man switch (interactive sessions create it, pre-commit re-touches it; if stale >2h while tree quiet >1h, loop takes over).
- `docs/loop/STOP` = hard pause, never auto-removed.
- **Single-writer rule:** never run the loop while an interactive session works the repo.

### Browser Verification Protocol

- Phaser 3 listens for MOUSE events — synthetic PointerEvents are silently ignored.
- Occluded tabs freeze rAF → drive `game.loop.step` manually via `window.__game`.
- `window.__game` seam (DEV-guarded, stripped from prod) is used for automated verification.

---

## 9. Open Decisions (Defaults Live Until Vetoed)

| # | Decision | Default | Veto |
|---|---|---|---|
| 1 | CRIT_MULT 1.3 (was spec 3) | Keep 1.3 | Revert combat.ts + config-values.test.ts |
| 2 | MAX_DAN_RANK 10 (was spec 5) | Keep 10 | Revert to 5 |
| 3 | Rebirth = elemental +10, stacking | Keep elemental | Restore attack semantics |
| 4 | ~~ESLint~~ | DONE | — |
| 5 | new-project.sh invalid JSON | Outside repo | — |
| 6 | Phaser 4 exists | Stay pinned 3.90.0 | — |
| 7 | Branch `master` | Keep | — |
| 8 | Dev-only `window.__game` seam | Keep | Delete the if-block |
| 9 | Gesture thresholds INFERRED | Keep, revisit at feel pass | — |
| 10 | Stat-point effects | CHI +5, HP +10, ATK +1, DEF +1, SPD +3 | A-14 flat +3 for ATK/DEF/SPD |
| 11 | Dialogue data home | Typed TS in `src/config/campaign/` | JSON at game/ boundary |
| 12 | Skills screen depth | Display + rank-up costs for 3 duel skills only | Display-only |
| 13 | Guest-currency seed site | Extend `initProgression` with optional `start` param | Seed at login flow in game/ only |

---

## 10. Key Reference Files

### In the SSHD 1-1 repo (`/Users/kheshav/kheshav-code/SSHD 1-1/`)

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project root rules, invariants, stack, commands, session discipline |
| `docs/MASTER_SPEC.md` | The verbatim original spec — Stages 0-6 with gate tables, all config values, execution rules |
| `RESUME_HERE.md` | Current state, next step, open decisions — READ THIS FIRST every session |
| `docs/research/SHSD_MASTER_REFERENCE.md` | **The research bible** — 108KB, 11 sections covering every aspect of the original game. Pair this BUILD_PLAN with that doc. |
| `docs/sessions/SESSION9_KICKOFF.md` | Next session entry point (dash-through slash + crouch depth) |
| `docs/sessions/STAGE4_KICKOFF.md` | Stage 4 campaign plan (title, dialogue, town, quests, RPG screens) |
| `docs/TELLS_CHECKLIST.md` | 36 fidelity tells (acceptance gate — 100% PASS = done) |
| `docs/CALIBRATION.md` | Calibration measurements |
| `docs/DIVERGENCES.md` | Documented deviations from original (with rationale) |
| `docs/research/fidelity/FIDELITY_GATE.md` | Fidelity gate protocol + history (55/55 PASS) |
| `docs/research/fidelity/MOTION_MEASUREMENTS.md` | Measured motion values (applied + pending) |
| `docs/loop/GOAL.md` | North star for autonomous build cycles |

### External to the repo

| File | Purpose |
|---|---|
| `~/kheshav-code/iaido-duel/` | Kheshav's own 15-joint skeleton system (already ported as Stage 4 M0) |
| Reference videos (gitignored) | `reference/frames/{Nr4fQstqHDM,zFtCaTO0_1M}/seg-*` — frame-by-frame extractions |
| `SHSD-MASTER-REFERENCE.md` (workspace) | The research bible — also adopted into repo at `docs/research/SHSD_MASTER_REFERENCE.md` |

---

## 11. Build Order Summary

```
Session 9 (NEXT):
  ├─ Owner feel-run
  ├─ Dash-through slash (Sim + render)
  ├─ Deepen crouch
  └─ Close → SESSION10 kickoff

Stage 4 — Campaign:
  ├─ M0: Skeletal fighters ✅ DONE
  ├─ M1: Boot flow + title screen
  ├─ M2: Name/story bible + dialogue system
  ├─ M3: Town scene + NPCs
  ├─ M4: Quest system
  ├─ M5: RPG screens (character sheet, equipment, skills, rebirth)
  ├─ M6: Structure (Season/Episode, haiku, tutorial prologue)
  └─ M7: Gate close

Stage 5 — War Room:
  ├─ Territory map
  ├─ Rival-clan strategic AI
  ├─ Deploy troops + flag bonus
  ├─ Kill/build caps
  └─ Elemental skill trees

Stage 6 — Polish:
  ├─ Four-way slash SFX
  ├─ Menu vs combat music
  ├─ Victory/defeat stings
  ├─ Heavy vs light tone difference
  ├─ Feel tuning pass
  ├─ Difficulty curves
  ├─ Background density
  └─ Brush display font

FIDELITY TELLS (36 items — acceptance gate):
  ☐ 1-6: Slash engine
  ☐ 7-12: Combat
  ☐ 13-16: AI/Feel
  ☐ 17-21: Art
  ☐ 22-28: UI/Audio
  ☐ 29-36: Progression/Lore
  → 100% PASS = done
```

---

## How to Use This Document with Fable 5

### For a new session, feed Fable this context:

1. **This BUILD_PLAN.md** — gives the full picture
2. **`SHSD-MASTER-REFERENCE.md`** — the research bible (what to build + how it should look/feel)
3. **`docs/MASTER_SPEC.md`** — the verbatim spec with all config values and gate tables
4. **`RESUME_HERE.md`** — current state (what's done, what's next)
5. **The current session kickoff** — e.g., `docs/sessions/SESSION9_KICKOFF.md`

### The one-line paste-prompt for Fable:

> Read `BUILD_PLAN.md` and `SHSD-MASTER-REFERENCE.md`, then read `RESUME_HERE.md` and the session kickoff it points to, and execute it. Invoke TDD before any code. Do not stop until the gate table is 100% ☑ committed, or you are blocked on a decision only I can make.

### For autonomous loop sessions:

The repo already has a `scripts/build-loop.sh` + `docs/loop/GOAL.md` crash insurance system. The loop reads `RESUME_HERE.md` → current kickoff → executes. This build plan is the meta-context that sits above all of that.

---

*End of BUILD_PLAN. Generated 2026-07-17 by Clawdia. Pair with `SHSD-MASTER-REFERENCE.md` for the complete picture.* 🪷