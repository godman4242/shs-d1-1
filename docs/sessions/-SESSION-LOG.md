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
- **09:20** Stage 2 M3 (two commits: M3a combo/strikes, M3b verbs) — 24 M3b
  tests watched RED first. Landed: kunai projectiles (pure core/projectile.ts
  + Sim-owned list, cap 8, straight-line INFERRED, flat 8 dmg INFERRED
  archer-chip pattern); skills via queueSkill + SKILL_COOLDOWN_MS (chiPunch
  4960 CONTRACT / smokeBomb 7960 + stab 920 INFERRED .92/.96 pattern; Chi
  COSTS deferred to Stage 3 — no Chi meter in the Stage-2 fighter model,
  flagged); smoke bomb dash-away + i-frames; stab deflect window with the
  deflectLearned gate deduplicated to ONE site after a chaos pass found an
  unkillable mutant (redundant double-gate — removed, single gate re-proven
  RED); spawn invuln PLAYER-ONLY (decision flagged: research frames it as
  respawn protection and an invulnerable enemy would break the first-slash
  gate item; veto = symmetric), ends on first offensive act (slash/chiPunch),
  boundary pinned 299-blocked/301-lands; Shunpo in integer 1/60-point units
  (drain 34, fill 12 INFERRED, hysteresis restart at exactly 10 — order
  test-pinned); PlayerIntent (moveX NaN-guarded at the boundary, clamped)
  + movement 280 px/s, arena-clamped, jump-owned while airborne. Spec
  collision caught and resolved: M3a strike tests fired inside the new spawn
  invuln → scenarios now end invuln via the canonical first-slash path.
  DuelScene: A/D + SHIFT + 1/2/3 wired, advance(delta × sim.timeScale)
  (spec item 11), kunai bolt render, invuln blink. Chaos: protection check
  → 3 RED · kunai cap → 1 RED · shunpo hysteresis → 2 RED · deflect gate
  → 1 RED (after dedup). Suite 251/251 · tsc both configs exit 0 · eslint 0.
- **09:30** Stage 2 M4 — AISeamController + config/ai.ts (20 unit + 4 Sim
  integration tests watched RED as missing modules). Telegraph-then-commit
  state machine (idle/telegraph/attack/recover/stancePending): strike lands
  exactly telegraphMs after its telegraph (pinned 32 frames Normal; also
  property-scanned over 600 frames — no untelegraphed strike); counter-pick
  queues AI_PENDING_STANCE_MS=600 INFERRED (spec names the concept, no
  value — flagged) behind a stance telegraph, and mirrors the Sim's Focus
  cost before committing; kunai only in the 240–720 band (tier chance;
  easy=0 proven over 300 frames); recover jitter ±AI_RECOVER_JITTER_FRAC
  via injected rng; react() = block/dodge roll at most once per reactMs
  (INFERRED: instant player slashes make latency unmodelable — reactMs is
  an attention cadence; veto = drop reactions). Sim side: OpponentView
  snapshot per tick, enemy moveX at ENEMY_SPEED arena-clamped, switchStance
  through requestStanceSwitch (same Focus gate), enemyTelegraph +
  strikeBlocked events; blocked/dodged swings keep the crit meter and don't
  chain the combo. core/time.ts extracted as the ONE msToFrames site.
  DuelScene: AISeamController(normal) wired, one shared mulberry32 stream
  (deterministic call order), pulsing windup flash (red strike/blue stance).
  Chaos: telegraph disarmed → 3 RED · affordability gate → 1 RED · react
  cooldown → 2 RED — restored GREEN. ESLint caught 6 issues in new code
  (unused import/param, array-type style, needless assertions) — fixed.
  Suite 274/274 · tsc both configs exit 0 · eslint exit 0.
- **09:55** Stage 2 M5+M6 — economy.ts (pins RED-first) + the fidelity
  scene layer, built FROM reference/frames (A-00 combat anatomy, B-23 HUD,
  seg-23 VS context; original art, shifted palette): samurai.ts fighters,
  banners.ts single banner family, bamboo parallax + letterbox, nameplate +
  overhead bar, portrait/coins/XP/skill-bar/combo-plate/AUTO-SLASH HUD,
  low-HP vignette, DuelIntro (VS→name→READY→FIGHT!, click-skip), DuelResult
  (+10/+8 exact, R restart), kill beat FINISHER_FLASH + timescale restore in
  create/shutdown/beat-end. Browser verify (Chrome MCP, dev seam loop-step
  protocol for occluded-tab throttling): slash 150→142 exact; SPACE denied
  at 50 focus / swap at 55.87→5.07 via REAL key; shunpo 0.35 on sim + BOTH
  Phaser clocks, restored on release; key-3 stab cooldown via real input;
  kill → combo 1 (CONTRACT) → YOU WIN +10 XP +8 COINS screenshot → R →
  fresh sim, timescales exactly 1, intro relaunched; zero console errors
  across a full boot→intro→duel→kill→result cycle. REAL BUG found by the
  browser: AI rolled tier chances EVERY TICK (kunaiChance 0.25/tick ⇒
  near-certain kunai each second, approach stalled at range) → RED cadence
  test (rng-call counting) → one-decision-round-per-reactMs fix → 281/281.
  Suite 281/281 · tsc both configs exit 0 · eslint exit 0 · build green.
- **10:03** Stage 2 M7 — 24-seed harness + determinism. Shared duel bot
  (tests/utils/duel-bot.ts) mirrors DuelScene wiring (one rng stream, Sim +
  AISeamController normal): good policy = slash cadence 45f + seeded
  humanized jitter (own mulberry32 stream — without it kills quantized to
  the swing grid and only 13/24 durations were distinct) + jump-dodge at
  telegraph+10 so the arc covers the commit frame. Results: 24/24 good-play
  wins · 0/24 no-play wins (no timeouts) · median 26.04 s in the spec's
  [20,60] band (reference ~24.7 s is the spec bot's own number — flagged,
  veto = retune cadence) · 24/24 distinct durations. Determinism: identical
  fingerprints in-process ×2 AND across two child vitest processes + the
  parent (three OS processes byte-identical; no extra runner deps — vite 8
  is rolldown-based, no vite-node/esbuild binaries). Chaos: Math.random
  planted in the trace → RED — after a first 1e-9 plant taught us the
  FNV fold quantizes at 1/256 and hid it (plant re-sized above the floor).
  Suite 287/287 · tsc both configs exit 0 · eslint exit 0.
- **10:08** Stage 2 M8 — game/ purity ratchet (spec item 15): per-file
  numeric-literal MULTISETS committed as tests/game-purity-baseline.json
  (224 lines, generated RED-first via the deliberate
  UPDATE_GAME_PURITY_BASELINE=1 path). New value or extra copies → FAIL,
  removals → pass, unbaselined new files → FAIL. Chaos: planted 31337 in
  samurai.ts → RED naming file+value+count · substituted a 4 for a 9 →
  RED ('9' ×2 allows ×1) · restored → GREEN. Reuses the Stage-0-hardened
  scanner (scanNumericLiterals) — no second literal-parser to drift.
  Suite 289/289 · tsc both configs exit 0 · eslint exit 0.
- **10:25** Stage 2 M9 (partial) — two scene-lifecycle bugs found LIVE in
  browser verify and fixed: (1) restarting the duel while the intro overlay
  is still active left a STALE intro driving the new run (scene.launch on an
  active scene is a no-op) → stop-then-launch in DuelScene.create; (2) on
  occluded-tab resume, Phaser's clock jump blew through the whole intro in
  3 frames (the original paused when hidden) → step-timer re-anchor on
  >500 ms jumps in DuelIntro.update. game-purity ratchet scored its first
  organic catch on fix (2) ('500' ×1 allows ×0) → baseline refreshed via
  the sanctioned env-var path. Gate evidence captured: VS card, Defeat
  +0/+0, invuln blink, Victory +10/+8, stance-swap Focus drain. Adversarial
  audit wf_d26dfb02-8f7: ALL 6 finders died on subagent session quota
  (resets 13:00 KL) — result {confirmed:[]} is a QUOTA ARTIFACT, not a
  clean bill; re-run required before sign-off. Suite 289/289 · tsc exit 0 ·
  eslint exit 0.
- **13:25** Kheshav awake: asked for "a straight rip off, as close to the og
  as possible". Line held and explained (no replication of the original's
  drawings, no verbatim dialogue — that's copying LutGames' expression);
  what he CAN have: exact mechanics (already 1:1), aggressive structural
  fidelity iterated against study frames, same plot/characters/beats with
  re-written dialogue, and his own palette-shift invariant vetoed. He
  accepted ("ok sure… revert the palette and resume the audit, do what you
  think is best"). EXECUTED: palette reverted to near-OG hues (colour
  schemes are unprotectable; drawings stay original) — palette.ts + COL pin
  + root/config CLAUDE.md + RESUME_HERE updated in one commit; memory file
  updated. Audit workflow resumed post-quota-reset (wf_d26dfb02-8f7).
  Suite 289/289 · tsc exit 0 · eslint exit 0. Next: fighter-art fidelity
  pass (samurai.ts v2) with before/after browser evidence.
- **13:40** Fighter fidelity pass v2 (samurai.ts rebuilt): ground shadow,
  hakama with center split + splayed feet, gi with open-vest V panels, obi
  belt + knot, double scarf tail, bigger head with profile nub, wide
  shallow kasa with brim ellipse + weave line (player) / topknot + headband
  tail (ronin), two-hand katana grip with tsuba + wrapped hilt, pose-angled
  blade (idle/windup/guard). Player look switched to white-gi + dark vest
  per the study-frame reading. Original drawing throughout — structural
  fidelity, no tracing. Ratchet baseline refreshed (deliberate, env-var
  path). Browser-verified with new palette: full-scene + zoom evidence
  saved. Suite 289/289 · tsc exit 0 · eslint exit 0.
- **18:50** Stage 2 M9 close (BACKFILL, logged 19:25 — commit 6a94aab
  landed without its log entry; discipline slip noted): audit re-run
  post-quota (36 agents) → 7 CONFIRMED findings, ALL fixed red-first:
  AI stall/dead kunai band (hard idle deleted; AI_APPROACH_RANGE stays
  Stage-4, flagged) · mid-tick double-fightEnded (ended-guard + sub-step
  re-check: ends exactly once, no posthumous strikes) · shunpo stuck at
  kill (force-stop + shunpoEnded, timescale 1) · intro-buffered skills
  discarded (stroke-discard parity) · critical.ts extracted (spec item 3;
  meter math one site) · GAME_WIDTH/HEIGHT pinned · jump strokes
  arena-clamped. Ratchet hardened: main.ts scanned, unscannable-payload
  parity, scene-tick guard, RED-receipt refresh. Suite 297/297 · tsc both
  configs exit 0 · eslint exit 0.
- **19:25** (Session 4) Stage 2 M10 — FX clock fix (audit-verified deferred
  finding): DuelScene FX ignored sim.timeScale (droplets integrated raw
  delta; trails/redStrokes/telegraph cues aged on raw time.now — Shunpo ran
  gameplay 0.35× while FX ran 1×). Fix: core/fx.ts (advanceFxClock +
  integrateDroplet, pure — the no-game-imports guard means scene code is
  untestable, so the math lives in core and the scene is wiring), 8 tests
  RED-first (stub → 5 assertion-RED → GREEN; semi-implicit-Euler order
  pinned — an old-vy reorder would zero the y-advance). DuelScene: fxNow +=
  delta × active-ts owns trail/stroke/droplet aging + integration +
  telegraph/guard cues (sim-time cues — flagged, veto = wall clock);
  kill-beat hold + invuln blink KEPT on wall clock (kickoff contract,
  ~0.9 s real). Feel constants stay scene literals under the M8 ratchet
  (config/CLAUDE.md bans invented blood constants — flagged, veto = move to
  config/fx.ts). Ratchet RED receipt: '0' ×47 vs baseline ×45 (the two
  fxNow=0 inits) → env-var refresh → diff reviewed (exactly 45→47).
  Browser evidence (Chrome MCP, dev-seam loop-step under occlusion):
  fx/wall = 1.0000 at ts=1 → 0.3500 with SHIFT held (sim.timeScale 0.35) →
  1.0000 on release; droplet aged EXACTLY 350 ms over 1000 ms wall of
  slow-mo, Δx 32.4 px = vx × fx-time to the decimal; real slash through
  RONIN 150→142 (exact 8) then trail+arc still on screen at fx-age 153 ms
  after ~350 ms wall (the wall-aged trail died inside that window pre-fix);
  timescales restored [1,1]; zero console errors from fresh load. Stale
  "trade-dress-shifted" palette lines corrected in DuelScene doc +
  docs/loop/GOAL.md (near-OG per owner veto 2026-07-12 — a loop cycle
  obeying GOAL.md verbatim would have re-shifted the palette against the
  veto). Suite 305/305 · tsc both configs exit 0 · eslint exit 0.
- **19:45** STAGE 2 CLOSED — full 18-item VERIFICATION GATE table assembled
  in RESUME_HERE.md, every box ☑ with an evidence pointer (this log's
  timestamps + commits + screenshots). Two items freshened LIVE before
  sign-off rather than trusting old notes: (1) kunai-at-range — held A via
  loop-step, kunai thrown at range 468 (band 240–720) after 60 frames,
  bolt on screen; (2) `?scene=duel` — confirmed a no-op by design
  (DuelScene IS the boot scene until Stage 6; main.ts comment). Two
  flagged deviations ride with the gate, both owner-defaulted: CRIT_MULT
  1.3 vs spec 3× (open decision #1) and harness median 26.04 s vs the
  spec's ~24.7 s reference-bot number. Next per SESSION4_KICKOFF §1: mine
  iaido-duel → upgrade agent-work-ethic → Stage 3.
- **20:05** iaido-duel mining pass (kickoff §1.3) — read CALIBRATION /
  DIVERGENCES / TELLS_CHECKLIST / RESUME_HERE + ART_DIRECTION pointer.
  ADOPTED (improved, not copied): (1) docs/TELLS_CHECKLIST.md — living
  status ledger over MASTER_SPEC's static tells list, each row citing OUR
  gate evidence; 20/36 tells already ☑/◐ from Stages 1–2; human-only rows
  marked Ⓗ. (2) docs/CALIBRATION.md — INFERRED-value measurement ledger
  (item/tolerance/seed/status) + the Ruffle frame-step upgrade method
  (study-only, RECREATE-NEVER-RIP compliant); 15 rows seeded, none
  CONFIRMED yet, queued as Stage-6 polish. (3) docs/DIVERGENCES.md — one
  deviation ledger (owner decisions, INFERRED readings, structural
  deviations, cross-project fact conflicts) replacing scattered flags.
  (4) RESUME trust-order header line. SURFACED for the owner: their spec
  lineage treats crit 3× as CONTRACT (measured 3.000 A/B) — strengthens
  the 3× case on open decision #1 (default 1.3 stands); their dan-rank
  contract is 5 vs our errata 10 (errata wins, decision #2); their coins
  +5 vs our verified 8 (ours verified — keep). REJECTED: two-tier purity
  with grandfathered core (ours is stricter: zero-literal core from day
  1); ?foes=N sparring dummies (multi-foe is Stage 4/5 world scope);
  kill-beat timescale RAMP 0.43 (our SYNTHESIS reads hard cuts — keep
  0.35 hard); swappable TITLE_WORDMARK / public-IP posture (ours is a
  private recreation; owner call if that ever changes); MouseEvents-only
  browser protocol (our PointerEvent + loop-step protocol proven today).
  Phaser particleAngle no-op landmine recorded in DIVERGENCES (we use
  Graphics, no emitters).
- **20:20** agent-work-ethic upgraded (kickoff §1.4): new
  playbooks/proof-discipline.md — the eight Fable-5-session moves
  generalized for any agent (binary gates + pasted evidence · red-first +
  chaos-proofs · double-entry pins · RED-receipt ratchets · veto-able
  decisions ledger · refuter-verified audits, dead verifier = UNVERIFIED ·
  dev-seam verification · handoff-in-same-commit). Committed LOCALLY
  (cff53b2) — NOT pushed; push is Kheshav's deliberate call (their SPEC
  §7). Root README tree also fixed (was missing two playbooks).
- **20:25** build-loop hardening (Kheshav asked for loop review):
  (1) PAUSE now re-checks every 60 s (was up to 30 min resume lag);
  (2) every cycle's output tees to docs/loop/loop.log (gitignored) with a
  timestamped header — overnight runs leave a postmortem trail;
  (3) optional LOOP_MAX_TURNS passthrough as hung-cycle insurance.
  sh -n clean. GOAL.md palette line was already fixed in M10. Stale
  session-3 vite (PID 46831, port 5173) killed; current dev server is
  task b7unkiuiy on port 5174.
- **20:35** STAGE3_KICKOFF.md written + committed (kickoff §1.5, entry
  point for the next session or loop cycle): errata-read scope (dan 10,
  elemental rebirth stacking, KILL_REWARD stays INFERRED), five-step work
  order (levelUp math red-first → XP-curve RESEARCH before inventing →
  Chi meter + skill costs, the Stage-2 deferral → accrual/persistence
  seam, core stays pure → gate table), 7-item gate (spec 6 + browser
  accrue-and-persist), landmines (harness re-pin discipline, coins=8
  verified, no invented constants, elemental TREES are Stage 4/5, no
  storage in core/). Session ends at a clean single-writer boundary —
  Kheshav signaled he may start the build loop.
- (milestones appended below as they land)

## Stage 3 — Progression (build loop, 2026-07-12)
- **STAGE 3 M1 (333/333): `core/progression.ts` — the levelUp / rebirth /
  dan-rank math, red-first.** TDD skill invoked before any code; the whole
  `progression.test.ts` (28 tests) watched RED (missing module) → GREEN.
  API (pure, ZERO numeric literals, all numbers from `config/economy`):
  `initProgression({hp,chi,ap})` (guards non-finite/negative maxes),
  `levelUp` (+1 SP / +3 stat / full HP-Chi-AP refill; SP clamped to
  FIRST_RUN_SP_CAP on the first run only), `canRebirth`,
  `rebirth(p, element)` (+10 chosen-elemental stacking, gold by tier
  earlyGold 1–9 / tenthGold 10th, reset to fresh L1, refill; refuses past
  MAX_DAN_RANK or on unknown element), `accrueCoins` (ignores non-finite /
  negative). ELEMENTS = fire/water/earth/wind (types only — Stage 4/5 build
  the trees; Stage 3 stores points).
  - **Config honesty (decision #3):** `economy.REBIRTH.attackBonusPerRebirth`
    renamed `elementalPointsPerRebirth` (the "+10 Attack" label was research-
    wrong) — economy.ts docblock + `config-values.test.ts` double-entry
    updated in the same change.
  - **Chaos-proofs (guard disarmed → matching test RED → restored → GREEN):**
    SP cap off → 200 SP RED; rebirth ceiling + element guards off → refuse
    + unknown-element tests RED; init pool guard off → non-finite/negative
    RED. Purity scanner proven to COVER the new file (planted `31337` at
    progression.ts:108 → RED naming file:line → removed → 32/32).
  - **Gate:** 6/7 items cleared headless (table in RESUME_HERE "State"); the
    7th (browser: kill → XP/coins accrue + persist across R-restart) is
    browser-only + needs the item-4 persistence seam — QUEUED at top of
    RESUME_HERE, left unchecked (GOAL headless-cycle rule).
  - **Ledgers:** TELLS rows 29–32 → ◐ (rules landed + unit-proven, in-game
    display pending); DIVERGENCES decisions #2/#3 marked LANDED + three
    INFERRED progression readings recorded (first-run-only cap, rebirth
    resets SP/stat, level not hard-capped) + `lateGold` unreachable note.
  - **Gate paste:** typecheck exit 0 · `vitest run` 333/333 (23 files) ·
    eslint exit 0. DEVIATION carried: MAX_DAN_RANK=10 (decision #2).
    Deferred (next): M2 XP curve (research first), M3 Chi meter + skill
    costs, M4 accrual/persistence seam (clears the queued browser item).
- **20:55** (Session 4 returns, interactive) Loop-M1 REVIEWED — verdict
  KEEP, revert declined (Kheshav offered "clear the loop's work"; senior
  call: the module is green 333/333 independently re-verified, red-first +
  chaos claims are logged in detail, ledgers moved in the same commit, and
  the code reads exactly as it should — pure, zero-literal, guarded,
  veto-flagged. Deleting correct work to redo it on a bigger model is
  waste; the bigger model's edge belongs on the HARD remainder: Chi/Sim
  integration, persistence seam, browser close. Veto = `git revert
  1c009e5`.) A hostile fresh-eyes review of M1 is queued as SESSION5 §1.1
  instead. **Dead-man takeover shipped** so work continues unattended
  across usage-limit cuts: PAUSE = soft pause heartbeated by the
  pre-commit hook every milestone commit; stale PAUSE (>2 h) + quiet tree
  (>1 h) → loop removes it and takes over; cycles ride quota outages via
  backoff; STOP = hard pause, never auto-removed; CYCLE_RUNNING lockfile
  guards the return handshake. Logic chaos-tested standalone (6/6
  scenarios: fresh/stale/missing PAUSE, active/quiet/excluded-noise tree);
  sh -n clean on loop + hook. SESSION5_KICKOFF.md written (bar reached):
  handshake → M1 hostile review → XP curve FROM STUDY DATA (L1–L10
  thresholds already extracted) → Chi meter + harness re-pin →
  persistence + browser gate → STAGE 3 CLOSED → Stage-4 kickoff.

## 2026-07-13 — Session 5 (interactive): Stage-3 close run

- **~20:30 (07-12)** Session 5 opens on the SESSION5 kickoff. TDD skill
  invoked first; loop handshake done (PAUSE touched, no CYCLE_RUNNING —
  loop idle, single-writer safe).
- **20:40→10:50** M1 hostile-review workflow (`wf_f3950331-e40`, 82 agents)
  QUOTA-KILLED mid-run: 5/6 attack lenses returned 25 raw findings, then
  the session limit killed the coverage lens, the dedup agent and ALL 77
  verifier votes. Audit rule applied: quota-killed = UNVERIFIED, never
  refuted → findings triaged INLINE this session (fixes = next commit).
  Decision: no more fan-out workflows this session (quota risk); veto =
  resume `wf_f3950331-e40` after reset for machine verification.
- **10:50** M2 XP CURVE landed red-first (`tests/xp.test.ts` watched RED on
  missing modules, then 11/11): `config/xp.ts` — XP_THRESHOLDS pins the ten
  frame-backed cumulative caps 550…31,400 (SYNTHESIS §1.2, one segment read
  each, CONTRACT; B-05's 15,350 anomaly excluded) + XP_DELTA_STEP=500
  (INFERRED L11+ extrapolation matching the 4550→5000→5500 delta tail,
  flagged); `core/xp.ts` — xpThreshold (table + extrapolated tail) and
  levelForXp (cumulative-cap semantics: reaching the cap finishes the
  level; O(level) walk, MAX_SAFE_INTEGER-safe, junk-input chaos guards).
  Double-entered in config-values.test.ts; chaos plant 550→555 → 4 RED
  across BOTH pin files → reverted → green. HUD XP denominator now reads
  the real curve (`xpThreshold(ONE)` in DuelScene, render-only; numerator
  stays 0 until the M4 profile seam). Gate paste: tsc both configs exit 0 ·
  eslint exit 0 · vitest 346/346 (24 files).
- **11:10** M1-REVIEW TRIAGE landed (SESSION5 §1.1, the 25 UNVERIFIED
  findings adjudicated inline with evidence). CONFIRMED + FIXED red-first:
  `accrueCoins` accepted fractional amounts and could overflow coins to a
  persistent Infinity (guard: integer + result-finite, junk ignored not
  thrown, 2 tests watched RED); `initProgression` accepted a zero pool max
  (0/0 → NaN bait downstream; guard now positive-only, 1 test watched RED).
  CONFIRMED coverage gaps → pins landed + chaos-plant-proven: rich-character
  preservation (levelUp keeps danRank/coins/gold/elemental pinned to KNOWN
  non-zero values; rebirth keeps coins + untouched elements; accrueCoins
  touches only coins) — plant "levelUp wipes elemental" → 2 RED → restore
  green; input-non-mutation snapshot pin on DRAINED pools (full pools would
  launder a mutating refill) — plant "refill mutates in place" → 1 RED →
  restore green. Plant-1 also exposed + fixed a weak first draft of the
  levelUp pin (compared against the input's own possibly-corrupted record).
  DOCUMENTED (DIVERGENCES "M1 review readings" + module docblock): SP cap
  clamps UNSPENT (revisit when spending lands), 79-SP-at-L80 arithmetic
  (veto = seed L1 SP=1), rebirth keeps grown maxes (unreachable until stat
  spending), scroll price/L80 gate = Stage-4 shop boundary, corrupt-save
  guards = M4 seam validator, tenthGold/MAX_DAN_RANK veto composition.
  REFUTED with evidence (logged in the ledger): pool-state-unreachable and
  fullRefill-dead-code claims. Misleading "on top" test name fixed. NO
  rewrite of surviving code (kickoff rule honored).
- **11:35** M3 CHI METER + SKILL COSTS landed red-first (the Stage-2
  deferral; 5 new Sim tests watched RED on the missing config/chi module):
  `config/chi.ts` — CHI_MAX=100 / CHI_FILL_PER_S=4 / CHI_COST
  {chiPunch 30, smokeBomb 25, stab 10}, ALL INFERRED (study has zero
  frame-backed cost reads; values sized for the prototype's 100-point meter
  family + 20–60 s duels), double-entered in config-values.test.ts. Sim:
  chi as integer frame-units on FighterState (spawn-seedable via
  FighterSpawn.chi — denial tests need no test seam; enemy pool fills but
  never spends, flagged), fill runs BEFORE the queued skill so post-cast
  reads are exact (max − cost pinned), tryCastSkill chi gate → new
  skillDenied event {verb, needed, chi}; cooldown-blocked casts stay
  silent (Stage-2 behavior, unchanged + pinned). CHAOS (kickoff-mandated):
  plant "denial consumes cooldown" → denial pin RED → restored green; the
  150-tick regen-to-exactly-cost cast doubles as proof the cooldown
  survived denial (a consumed CD would still block at tick 150 < 298).
  HUD (B-23 anatomy): CHI takes the blue under-HP slot (the OG pair);
  Focus — our INFERRED meter — demoted to a kimono2 strip, SPACE-drain
  gate visibility kept; Shunpo/Critical slivers shifted; denial flashes
  the chi bar blood-red 300 ms on the fx clock; ready-but-unaffordable
  skill slots grey out (B-23's zeroed slot). Ratchet: RED receipt pasted
  (9 value-count bumps, all HUD-edit-traceable) → deliberate refresh →
  4/4. 24-SEED HARNESS re-run: 4/4 UNCHANGED (the bot casts no skills; no
  Sim surface it measures moved) → no re-pin needed. Browser look at the
  chi bar/denial flash DEFERRED into M4's mandatory browser session (one
  dev-server pass covers chi HUD + persistence gate). Gate paste: tsc both
  configs exit 0 · eslint exit 0 · vitest 360/360 (24 files).
- **12:40** M4 ACCRUAL + PERSISTENCE SEAM landed red-first → **STAGE 3
  CLOSED 100% ☑**. Core: `Progression.xp` (init 0; rebirth resets it —
  level is DERIVED from xp, flagged); `core/profile.ts` accrueXp (one
  levelUp per threshold crossed via the M2 curve; junk ignored) +
  sanitizeProgression (reject-don't-repair validator, rebuilds
  field-by-field, strips unknown keys, cross-field invariants:
  level==levelForXp(xp), first-run SP cap). REAL BUG caught by my own RED
  test mid-milestone: a Number.MAX_VALUE accrual passed isInteger and hung
  levelForXp's O(√xp) walk for ~1e152 iterations (suite hang, killed) →
  policy tightened to SAFE integers across accrueXp/accrueCoins/validator
  counts, red-first each (a hostile save xp:1e300 would have DoS'd the
  loader). config/profile.ts A-00 guest pools CONTRACT (10/10/30);
  guest currencies deferred to Stage-4 login (DIVERGENCES M4-d).
  game/profileStore.ts = the ONLY localStorage site (versioned key, every
  load through the validator, never throws). DuelScene renders the
  profile (coins + xp/threshold); DuelResult accrues on win only (display
  stays KILL_REWARD math — +10/+8 parity). Ratchet: new-file RED receipt →
  refresh (empty literal set). BROWSER GATE CLOSED (Chrome MCP, dev-seam
  loop-step under occlusion — document.hidden froze rAF at frame 5, the
  known landmine; protocol recipe held). Protocol notes for next time:
  Phaser 3 listens for MOUSE events — synthetic PointerEvents are ignored
  (cost 3 defeats to diagnose); the harness bot's exact tactics ported
  (slash every 45+jitter frames, jump at telegraph+10 covers the +32
  commit) won at 2023 frames ≈ 33.7 s with 76 HP left. Evidence: YOU WIN
  +10 XP / +8 COINS screenshot · save {xp:10, coins:8} · R-restart HUD "8"
  + "10 / 550  XP" (screenshot) · full page reload persists · 3 defeats →
  +0/+0, save stays null · corrupt save (danRank −1) → fresh profile ·
  M3 chi bar + red denial flash + greyed slots (zoom screenshot; denial
  frozen live via the fx clock, cooldown-untouched re-proven in-browser) ·
  zero console errors from fresh load. Ledgers same commit: TELLS row 32 ☑
  + row 29 curve-wired; CALIBRATION rows 16 (chi economy) + 17 (XP tail);
  DIVERGENCES M4 seam policies. Gate paste: tsc both configs exit 0 ·
  eslint exit 0 · vitest 377/377 (25 files).
- **13:05** STAGE4_KICKOFF.md written + committed (campaign: boot/title →
  name-story BIBLE + dialogue → town/NPCs → quests → RPG screens →
  Season/Episode/haiku structure → gate close). The stage-ruling invariant
  gets its own section: every clan/character/place name and every line of
  dialogue INVENTED (the spec's 1:1 name list is permission-gated; we keep
  structure/mechanics only), M2 bible = single source for all campaign
  text. Carried decisions #10–#13 with defaults (stat-point effects
  contradiction, dialogue data home, skills-screen depth, guest-currency
  seed site); landmines include the M1-review Stage-4 bindings (SP cap →
  total-earned, rebirth pool-max reset, L80 UI clamp) and the browser
  protocol lesson (Phaser wants MOUSE events; loop-step under occlusion).
  KICKOFF BAR: reached — scope is the spec's produce list verbatim, every
  milestone carries its research anchor + proof method, decisions have
  defaults + veto paths, and one polish pass fixed a TELLS row-number
  error. SESSION 5 CLOSE: Stage 3 opened at 6/7 gate items — closes 100% ☑
  with M1-review, M2, M3, M4 landed red-first (333→377 tests), ledgers
  current, Stage-4 entry point committed.
- **(follow-up turn)** Post-close follow-ups per Kheshav review: (1)
  build-loop.sh now stamps claude's REAL exit status into loop.log per
  cycle (the 07-12 log had bare headers 6 s apart with zero output —
  undiagnosable; POSIX-safe brace group, sh -n + bash -n clean). (2)
  STAGE4_KICKOFF gains **M0 — skeletal-fighter port from iaido-duel**
  (decide-and-flag, veto = drop M0): samurai.ts's 3 static poses can't
  walk, recoil, collapse, or show per-stance arcs; the town scene (M3)
  hard-requires a walk cycle, and the ~890-line same-owner skeleton
  system (15 joints + animator + tests) closes TELLS row 20. Adaptation
  rules written into the milestone (keyframes→config, anim math→core
  red-first, drawing→game under the ratchet, harness re-run). (3) Loop
  status reviewed: NO cycles ran since Session 5 (last log entry 07-12
  19:51); the loop's only committed work remains Stage-3 M1, already
  hostile-review-hardened this session.

## 2026-07-13 — Session 6 (interactive): Stage 4 — campaign

- **Kickoff.** Loop handshake done (PAUSE touched 13:23, no CYCLE_RUNNING).
  TDD skill invoked before any code. Baseline verified: 377/377, Stage 1–3
  gates 100% ☑. Prompt-pack review (Kheshav-supplied HTML, all 4 master
  prompts read): the 1:1 prompts carry the permission-gated original name
  list → treated as the FORBIDDEN list for the Stage-4 original-names
  invariant; the homage prompts contribute one adoptable pattern — a
  grep-zero "legal check" gate, which we will land as a real Vitest guard
  (chaos-proven) when campaign text starts (M2). The homage prompts' own
  lore names are reserved for iaido-duel → our bible invents fresh names
  distinct from BOTH (decide-and-flag; veto = adopt iaido's homage lore).
  Nothing else in the pack supersedes STAGE4_KICKOFF (kickoff is newer and
  carries the repo's decided deviations).
- **M0 start — skeletal fighters (port from iaido-duel).** Decisions
  (decide-and-flag): (a) hitboxes STAY Stage-2 rects for Stage 4 — limb
  capsules would re-open combat calibration + harness pins mid-campaign
  stage; deferred to a fidelity pass (veto = port worldLimbs now).
  (b) worldLimbs/severed-limb draws not ported until that decision flips
  (YAGNI — nothing consumes them). Adaptation per kickoff: keyframes +
  motion amplitudes → src/config/anim.ts + poses.ts (INFERRED, authored at
  OUR study-frame proportions, not iaido's slim build); easing/phase/
  locomotion/animator math → src/core/ (zero-literals) with iaido's tests
  ported red-first; pose-driven drawing → game/samurai.ts under the
  ratchet (RED receipt).
