# SSHD 1:1 — Session Log

Crash-resilience log. Updated per milestone, never "at the end."

## 2026-07-11 — Session 1: Stage 0 scaffold

- **00:00** Session start. Quality layers (ship-bar hook + pre-commit gate) already installed and verified in prior turn. Node v25.8.2, npm 11.11.1, branch `master`.
- **00:01** Plan: scaffold Vite+Phaser3+TS+Vitest → tests red-first → configs/core → gates green → chaos-proof purity test (plant literal → red → remove → green) → parallel verification workflow (spec-exactness audits ×5, original-game research ×3) → wire pre-commit cmds → docs/handoff → commit.
- **00:36** Tests written FIRST → red run confirmed (21 failed, no src/). Toolchain finding: npm `latest` grabbed **Phaser 4.2.1** and **TypeScript 7.0.2**; spec fixes Phaser 3 → pinned `phaser@3` (3.90.0); TS7 native lacks the compiler API the purity scanner uses → pinned `typescript@^5` (5.9.3).
- **00:38** GREEN: `tsc --noEmit` exit 0 · 31/31 tests. Chaos-proofs: planted literal in core → purity RED (`_purity-canary.ts:1:36 → 42`) · planted `import Phaser` in core → dependency guard RED · canary removed → 31/31 GREEN.
- **00:39** `npm run build` green (1.2 MB chunk = Phaser, cosmetic). Real-browser boot verified via Chrome: letterboxed sky gradient, `Phaser v3.90.0 (WebGL | Web Audio)` banner, zero console errors.
- **00:40** Pre-commit gate wired: BUILD=`npx tsc --noEmit`, TEST=`npx vitest run`, LINT empty (no linter in fixed stack; open decision). Docs landed: root CLAUDE.md, nested CLAUDE.md ×3 (core/config/game), RESUME_HERE.md, .gitignore (+`reference/` for study videos).
- **00:42** Launched verification workflow `wf_16a0092b-8e9`: 5 read-only adversarial audits (palette exactness, constants exactness, purity-gate bypass review, toolchain, Stage-0 completeness) + 3 research agents (portals/wayback, wikis/community, video) verifying CONTRACT claims about the original game.
- **01:00** Workflow `wf_16a0092b-8e9` returned (8/8 agents, ~17 min, 562k tokens). Palette + constants transcription: EXACT. Purity gate: 2 blockers (dynamic-import fail-open; .mts/.cts blind spot) + warns → scanner hardened (isStringLiteralLike + fail-closed non-static, .mts/.cts coverage, unscannable-payload check, triple-slash directives, implicit enum ordinals, import-equals, TSX ScriptKind) with regression fixtures in tests/fixtures/scan-probe/. Toolchain: split tsconfigs, index.html hardening (no double-centering, touch-action none), Phaser.WEBGL explicit, engines pin. Completeness: caught INVALID JSON in .claude/settings.json (installer bug — ship-bar hook silently dead) → fixed + validated.
- **01:05** Research (11 confirmed / 4 partial / 3 unverifiable / 2 contradicted) digested into docs/research/original-game-facts.md. Spec correction applied: CRIT_MULT 3 → 1.3 (evidence-backed, veto path documented). Deferred corrections queued in RESUME_HERE (dan rank 10, elemental rebirth bonus, 4 clans, War Room framings).
- **01:20** /watch invoked on two FlashGamesArchive longplays (A=zFtCaTO0_1M 69m45s "PART 1", B=Nr4fQstqHDM 65m51s "PART 2"). Kheshav's constraints: watch FROM 0:00 (deep-link timestamps stripped; loading screen + login page at start are the listening check), document everything (mechanics + story + login page), make every step crash-resilient. Protocol + resume rule: docs/research/video-study/STUDY_PROTOCOL.md. Downloads → reference/videos/ (gitignored) running in background. No commentary in these videos → frames-only (--no-whisper).
- **01:35** Videos downloaded (A+B → reference/videos/). A-00 dense pass DONE from t=0:00: login page (username/email + password, REGISTER/LOGIN, PLAY AS GUEST, Facebook login, language dropdown, Explosive Barrel logo, **v0.717**) at frame 1; loading screen (logo + LOADING... + rotating TIP line) at t=0:03. Full notes → docs/research/video-study/segments/A-00-boot-login.md (intro cinematic story, PROLOGUE + haiku cards, HUD anatomy, dialogue/choice UI, FIGHT! intro, combo counter, kill-beat red screen, YOU RECEIVED modal, LEVEL 2 modal +3/+1, PLAYER sheet incl. AP pool + weight 14/100 + branch weapon, QUESTS screen incl. TAKE ME THERE = 5 gold). New config territory catalogued (XP thresholds 550/663, guest start 100c/3g, etc.).
- **02:05** Sweep wf_8bebd64e-7ff hit the plan session limit (resets 4:30am KL): map:B completed (32 chapters, salvaged from journal → B-MAP.md); map:A + all 24 dense B-segments failed on quota, zero data lost (frames + journal on disk). Script mapsMustSee mislabel bug fixed in persisted script (cache-safe). Resume command written into STUDY_PROTOCOL ⚡ section; RESUME_HERE refocused: resume sweep → SYNTHESIS.md → Stage 1.
- **15:20** 2nd sweep run: map:A completed (41 chapters, salvaged → A-MAP.md; PART 1 has NO War Room; finds incl. World Map w/ territory levels, item affix system, weapon condition/whet stone, YOU WERE DEFEATED → Leave Area/Free Respawn, bounty board, gambling den). All 48 dense agents died on quota again (reset 3:50pm KL). Sweep script tuned cache-safely: dense agents → sonnet/medium, high-priority-first execution, ≤60 frames/seg. Protocol ⚡ section now documents the repeat-after-each-reset loop.
- **16:45** 3rd sweep run (post-3:50pm reset) COMPLETED: 48/48 dense segments written + VERIFIED, 0 failures (50 agents, ~34 min, 3.6M subagent tokens). Checkpoint commit `db3118a`. Sweep logs revealed the 24/video quota cap dropped 40 mixed-priority slices — 12 held unstudied mechanics (AP costs, timed quests, archer, ladder, key pickup, Recent Happenings Board…), so a follow-up tranche `wf_c73bc346-e75` was launched over exactly those (decide-and-flag; other 28 = documented grind).
- **17:00** Follow-up tranche COMPLETED: 12/12 (A-25…A-30, B-24…B-29), 0 failures. Study evidence base final: 61 verified segments. Big finds: stance = instant out-of-combat toggle + hard in-combat lock; AP menu-only w/ cost pattern picks-1/searches-2/stable-5; timed-quest journal FINISH/ABANDON + day expiry; faction-influence tradeoff (+prosperity AND +Aka Ryu influence); ladder = BUILD progress action; keys = abstract quest-flags; XP threshold curve L1–L10 complete.
- **17:30** SYNTHESIS.md written (9 sections: mechanics catalogue, story, UI inventory, feel, research cross-check, contradictions, config-territory table, skip list, wishlist) + adversarial 4-agent verification workflow `wf_f8211741-fb4` over every citation/number. original-game-facts.md got the video cross-check block; STUDY_PROTOCOL ⚡ neutralized (sweep done, don't re-run); RESUME_HERE refocused to Stage 1. **VIDEO STUDY COMPLETE.**
- (milestones appended below as they land)

## 2026-07-11 — Session 3: Stage 1 slash engine

- **00:00** Session start from `docs/sessions/STAGE1_KICKOFF.md`. Read order done
  (kickoff → MASTER_SPEC Stage 1 + errata → SYNTHESIS §1.1/§4/§6/§7 → folder
  rules). TDD skill invoked BEFORE any code. Plan: ESLint (decision #4 default)
  → TDD core vec→geometry→gesture→DrawnStroke→stance→slash (+trajectory pulled
  forward for the jump-arc gate item) → config nums/fx + pins → chaos red-proofs
  → game-import test guard → DuelScene → browser verify → audit workflow → gate
  evidence. Deviation flagged: gesture.ts TDD'd before DrawnStroke.ts
  (DrawnStroke delegates classification); veto = inline classification.
- **00:20** ESLint milestone GREEN: eslint 9 + typescript-eslint 8 flat config
  (strictTypeChecked + stylisticTypeChecked, explicit two-project array because
  projectService only auto-finds tsconfig.json). 2 rule tunings flagged
  (template allowNumber; array-simple). Existing-code fixes: OpponentIntent
  empty-interface gets an explained disable. lint+tsc+42/42 tests green.
  Doc miscount fixed: Stage 0 suite is 42 tests, not 43.
- **00:55** Core TDD milestones GREEN, each watched RED first: vec (12 tests,
  + config/nums.ts), geometry (20 tests: concave/windings/collinear/clamp/null
  contracts), gesture (14 tests; new config/gesture.ts INFERRED thresholds
  45°/90px, flagged), DrawnStroke (12 tests: resample+cap+Chaikin+derivations).
  **Chaos red-proof done:** finite-guard disarmed → `NaN/Infinity clamp` +
  `±1e308` tests RED (NaN leaked into points; length went Inf) → restored →
  12/12 GREEN. Suite 102/102, lint + both tsconfigs green.
- **01:05** stance.ts (8 tests: enum→StanceId, triangle, counterMult) +
  slash.ts (14 tests: hit/miss/inside, formula incl. crit·counter stack,
  DAMAGE_FLOOR, whiff-crit=false, multi-foe, lethal-only severing) — RED
  first, then GREEN. Suite 122/122.
- **01:15** Kheshav asleep — authorized continuous autonomous work overnight
  (memory: project-overnight-autonomy). Honest scope set: Stage 1 gate green +
  deep Stage 2 progress by morning, NOT "the whole game" (Stage 6 gate needs
  his hands). Committed crash insurance: scripts/build-loop.sh +
  docs/loop/GOAL.md (fresh `claude -p` cycles, PAUSE file, backoff,
  stage-gate-aware hard rules, single-writer warning). NOT running it now —
  this session stays the single writer.
- **01:40** config/fx.ts (pins RED→GREEN; caught a `*/` inside the docblock
  breaking parse — also caught that piping vitest to `tail` masks its exit
  code; stopped doing that). Sim milestone: trajectory.ts pulled forward
  (5 tests), Sim Stage-1 surface (10 tests), config/duel.ts INFERRED pins.
  Game-import guard chaos-proven (direct + transitive canaries RED → GREEN).
- **02:20** DuelScene + browser verification (the payoff round):
  - Boots in Chrome: layered forest, capsule fighter, HP bar, Phaser 3.90
    WebGL banner, ZERO console errors (pasted).
  - **Two real bugs found by driving the browser:** (1) sim ticks were tied
    to render frames — occluded-window rAF throttling froze the jump; fixed
    with a fixed-step wall-clock accumulator (60Hz, 250ms clamp) in update().
    (2) a jump gesture while airborne captured mid-air y as the new ground —
    fighter floated forever; fixed in Sim (spawn groundY anchor + one-jump-
    at-a-time), RED test first, then GREEN. Plus: stroke release point was
    dropped (pointerup coords now appended; landing verified exact 430/430).
  - Occlusion made 200ms FX unphotographable → dev-only `window.__game`
    handle (DEV-guarded) + manual loop.step()/sleep() protocol captured:
    two-layer blade trail zoom (white core in chi-blue edge, pinched tips),
    directional blood both ways (right-cut spray right, left-cut spray left),
    jump takeoff/apex/landing state reads ({400,430}→{406.6,310.8}→{430,430}).
  - HP-based partial damage on screen: 100→88→76→64 (exact 12s).
- **02:35** Purity gate re-chaos-proven (planted `42` in core → RED at exact
  file:line → removed → 32/32 GREEN). Launched adversarial audit workflow
  `wf_925893f5-430` (4 auditors + refute-verify, 18 agents, 906k tokens).
- **03:00** Audit returned 7 CONFIRMED findings (11 claims refuted with
  evidence) — all fixed + proven:
  1. 13 spec-named combat.ts stroke/blade/blood constants had no value pins →
     pinned (double-entry ratchet restored).
  2. Single-point tap = full-damage hit at the core seam → Sim gates
     degenerate strokes (<2 points); RED test first.
  3. Game-import guard failed OPEN on .js-suffixed imports, phaser subpaths,
     non-static dynamic imports → fail-closed + suffix mapping + prefix match;
     chaos-proven with all 3 evasion canaries (RED ×3 → GREEN).
  4. 45° gesture boundary unpinned → exact-boundary tests added,
     mutation-proven (<= flipped to < → RED ×2 → restored GREEN).
  5. polylineLength had no direct tests → 3 added.
  6. SLASH_ARC.taperPow/minTaper were dead config (red stroke reused
     BLADE_MIN_TAPER) → strokePinched parameterized per render path.
  7. Off-canvas release swallowed strokes ('pointerupoutside' unhandled) →
     both release events finish the stroke; browser-verified (window-level
     mouseup beyond letterbox → hp 100→88, dragging cleared).
  Suite 155/155 · lint green · tsc both configs green.
- **03:10** **STAGE 1 GATE: 100% ☑ GREEN** — sign-off commit `ebc1335` with
  full evidence table in RESUME_HERE; STAGE2_KICKOFF.md written + committed.
- **08:05 (2026-07-12)** Kheshav awake: (1) confirmed the loop question —
  scripts/build-loop.sh already committed, single-writer rule restated;
  (2) GitHub repo requested as "shs:d1-1" — ':' is invalid in repo names,
  creating private `shs-d1-1` (veto = public/rename); (3) fidelity feedback:
  Stage-1 testbed doesn't look like the OG — binding kickoff amendment pulls
  fidelity tells 17–19/21–25 into Stage 2 scene work (memory saved);
  byte-by-byte recalibrated to 1:1-in-motion (invariants keep palette shift).
  Stage 2 opened: mulberry32 RED→GREEN (6 tests incl. independent reference
  pinning, uint32 wrap, uniformity). Suite 161/161.
- **08:35** Stage 2 M1 — `Sim.advance(deltaMs)` skeleton (TDD, 7 tests watched
  RED first as `advance is not a function`): owed-frames accumulator computed
  from TOTAL elapsed time (multiplicative, drift-free — repeated subtraction
  dropped a tick at exact step boundaries: 50 ms → 2 ticks; node repro pasted
  in session) with `FRAME_QUANT_EPS=1e-9` 1-ulp floor guard (named in
  timing.ts, pinned). Chaos-proofs: NaN/negative guard disarmed → exactly the
  2 guard tests RED → restored GREEN; MAX_FRAME_MS clamp disarmed →
  `advance(∞)` = synchronous infinite loop, runner hung + killed (stronger
  than red) → restored GREEN. Full spec-item-9 `config/combat-sim.ts` +
  `MS_PER_S` landed, every value double-entry pinned in config-values.test.ts
  (same commit). DuelScene migrated onto `sim.advance(delta)` — inline
  accumulator + inline `250` + FIXED_HZ import deleted. Suite 177/177 · tsc
  both configs exit 0 · eslint exit 0.
- **08:55** Stage 2 M2 — two-fighter Sim + damage/meters/stances (41-test
  suite watched RED first: `advance is not a function` → constructor shape).
  Landed: player+enemy FighterState (FighterView reads, hitbox(side));
  defense in resolveSlash — damage = max(FLOOR, atk×dmgMult×crit?×counter? −
  defense×(heavy ? 1−HEAVY_DEF_PENALTY : 1)), heavy penalty DEFENSE-SIDE at
  ONE site, damageTakenMult data-only (landmine honored + documented at the
  application site); phase model intro→fighting→ended, pre-FIGHT strokes
  discarded (gate item), fightEnded exactly once; Focus+Critical meters in
  integer frame-units (multiply-first exact — no fp drift; crit consumed
  only on LANDED hits); stance switching free out-of-combat (CONTRACT) /
  Focus-gated in-combat (INFERRED), cost = FOCUS_SWITCH_COST ×
  WEAPON_WEIGHT[stance being LEFT] (decision flagged; veto = key on target);
  SimEvent[] queue + drainEvents; nextStance SPACE cycle (STANCE_CYCLE
  INFERRED); FOCUS_FILL_PER_S=4 INFERRED (no spec constant — flagged, veto =
  fill-on-hit); DUEL_SPAWNS replaces DUMMY_SPAWN/DUEL_ATTACKER (pins moved
  same commit); DuelScene interim renders both fighters + HP/Focus bars,
  SPACE wired, mulberry32(Date.now()) at the boundary. Config-invariant
  near-miss caught in self-review: duel.ts briefly imported core's Vec —
  config imports nothing outside itself; replaced with structural type.
  Chaos-proofs: damageTakenMult double-application planted → 17 RED ·
  phase gate disarmed → intro-fill + AI-seam tests RED · nextStance cycle
  broken → RED · crit-consume removed → A/B test RED — all restored GREEN.
  Suite 202/202 · tsc both configs exit 0 · eslint exit 0 (caught one
  unsafe enum comparison in new code — fixed).
- (milestones appended below as they land)
