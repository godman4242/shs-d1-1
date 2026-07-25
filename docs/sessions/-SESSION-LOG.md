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

## 2026-07-16 — Fidelity gate v1 (Session 6, interactive)
- **M0 WIP adopted + committed** (4a27cd7): prior session's skeletal-fighter
  in-flight work checkpointed green (408/408 at commit; purity baseline
  refreshed for its draw offsets — diff was the review surface).
- **Fidelity gate v1 SHIPPED — the "measure, don't eyeball" harness**
  (green-lit by Kheshav; adapted from the clone-app-pat-pro evaluation):
  frame-MEASURED assertions (src/config/fidelity.ts, 17 probes with
  per-probe provenance) + pure comparator (src/core/fidelityCompare.ts,
  zero literals) + dev-only browser harness (src/game/fidelity.ts,
  `await __fidelity.run()`, occlusion-proof via manual loop-step fallback,
  localStorage backed up around the result-win pass). Unit layer red-proofed
  (2 test files watched failing on missing modules first; 15 tests).
- **Reference measurement**: native 1080p frames from B-23 (VS-duel window
  t=3771–3783), landmark medians across 3–4 frames; cross-checked vs A-28
  wild-mob fight by a verification agent — combat HUD geometry IDENTICAL
  across videos/locations (Δ≤6px @1080p), coins/XP/minimap hidden in fights,
  full-bleed 16:9 (no letterbox in live combat).
- **System-level red→green**: first browser run 14/17 FAIL (honest divergence
  map) → measured fix pass (bars/portrait/slots/plate geometry + palette:
  healthGreen #02990b, focusBlue #2e49e2, +8 measured entries, double-entry
  pins updated; slots moved bottom-center→bottom-right; letterbox strips
  removed; coins/XP chrome removed; white VS nameplate + gold GUEST
  overhead; DuelResult flat #a30e00 + silhouette band) → **17/17 PASS**,
  most probes Δ0. Two plate probes re-pointed mid-pass after re-measurement
  exposed glyph-AA contamination (assertion follows measurement).
- Evidence: suite 423/423 · tsc exit 0 both configs · eslint exit 0 · zero
  console errors from fresh load · eyeball screenshot of the fighting state
  matches the OG HUD anatomy. Ledgers: DIVERGENCES +6 entries (ring, chrome,
  letterbox, slivers, GUEST, two greens), TELLS 21 amended.
- **Extras**: docs/research/fidelity/FIDELITY_GATE.md (protocol + v2
  backlog: VS-intro probes, defeat card, lossless-PNG color refinement) ·
  docs/research/reference-sources.md (source sweep: Wayback official-wiki
  lossless PNGs = best color reference; Flashpoint dead end confirmed).
- Session interrupted once mid-fix-pass (process exit) — resumed with zero
  loss (tree state + this log + RESUME_HERE carried it).

## 2026-07-16 — Fidelity v2 slice 1: lossless corpus (Session 6 cont.)
- **Owner decisions this block**: approved the Wayback wiki downloads;
  green-lit fidelity v2. Renewed pixel-by-pixel-copy ask (now framed as
  private-then-modify) DECLINED again — reproducing the art then altering it
  is still reproduction; line stands regardless of release plans. The
  measured-everything ceiling is the standing target.
- **Lossless corpus secured**: 43/46 archived official-wiki images (2016
  crawl, real bytes) → gitignored reference/wiki-png/. CDX myth-check: the
  named headliners (Title2/PrtScrn/stance shots) only exist as 2025 404
  captures — first sweep's "~60 screenshots" corrected in
  reference-sources.md. Fandom's 178 images enumerated via api.php;
  targeted pulls queued for the Stage-4 title milestone.
- **6-agent classification workflow** (wf_30f6eefd-2d0): 43/43 mapped. One
  lossless in-combat HUD shot (A8.PNG, 2016 800×480 build), two
  kill-silhouette cards, two War Room maps, rest story scenes.
- **Authored #990000 recovered byte-exact** (A5 ×2 pts + Wiki14 + A8 combo
  numeral): winRed, combo numeral, and both win-bg probes updated — browser
  gate now reads the win card at Δ0. Video's #a30e00 was the codec shift.
- **Palette corroborated** by A8 lossless reads (blue/plate/slots all within
  ≤14/channel of video-derived values — no changes). NEW finding: OG bars
  are gradient-shaded → slice-2 backlog (row-resolved video measurement).
- Schema guard caught a provenance-less probe note mid-edit (the /t=\d+/
  pin) — fixed; the guard earns its keep.
- Evidence: gate 17/17 (win probes Δ0) · suite 423/423 · tsc exit 0 ·
  eslint exit 0.

## 2026-07-16 — Fidelity v2 slice 2a: gradient bars (Session 6 cont.)
- **OG bar gradients measured and shipped**: per-stage-row color stops
  (BAR_GRADIENTS in config/fidelity.ts) sampled off B t=3772-3776 at 1080p
  (spreads ≤9; focus strip single-frame — its fill length moves in-fight),
  mapped row-for-row to our 1024×576 stage (best-possible downsample).
  DuelScene renders HP/chi/focus as measured row strips; chi denial flash
  unchanged. Red-first ×2: BAR_GRADIENTS schema tests failed on missing
  export; 3/4 new gradient probes watched RED in-browser against the flat
  bars, then GREEN after wiring (hp-top Δ9, other three Δ0).
- Gate now 21 probes, 21/21 PASS. Suite 426/426 · tsc exit 0 · eslint
  exit 0 · ratchet refreshed (row-strip literals, diff reviewed).

## 2026-07-16 — Fidelity v2 slice 2b: dense gate 55/55 across 5 states (Session 7)
- **Measured** (medians ×3 frames, python/PIL over ffmpeg extracts): VS beat
  (B 60fps dense t=3771.55-3772.55 — band rows 448-584 pure #000, VS glyph
  bbox + core #ff1800, name rows/colors, portrait boxes), FIGHT! beat
  (B t=3773.48-3773.65 — same band, glyph (824,492)-(1090,572), gradient
  anchors (255,109,0)/(255,181,0)), defeat card (A t=3361-3364.3 — field =
  the same authored #990000 as the win card, pillars, splash, buttons,
  silhouette top), win-card pillars (B t=3783.2-3783.8 — v1 missed the
  inset; the olive band reading also failed to reproduce → corrected).
  **Discovery: the OG duel intro is VS → FIGHT! only** — names live in the
  band; no name banner, no READY (spec item 12 corrected, DIVERGENCES).
- **Built red-first**: compareScan edge-scan kind (7 unit tests watched RED
  → core impl → GREEN); schema tests for 5 states + scans (RED → config →
  GREEN); harness states vs-intro/fight-splash/result-defeat via a DuelIntro
  devHoldAt seam; browser RED run = 29/55 FAIL against the old render
  (pasted in FIDELITY_GATE.md). Refits: DuelIntro two-beat (procedural VS +
  FIGHT! glyphs — fonts put ink off the measured strokes twice), DuelResult
  shared inset card + defeat splash/headline/buttons, DuelScene fraction
  labels + measured name gold. Chaos: olive band plant → 4 RED → revert.
- **Close: gate 55/55 PASS (41 points + 14 scans) on a fresh load, zero
  console errors. Suite 440/440 · tsc exit 0 both configs · eslint exit 0.**
  Ledgers: DIVERGENCES slice-2b block, TELLS row 25 amended, gate doc
  slice-2b section. Kickoff-bar self-report: gate items 1-4 of
  FIDELITY_V2_KICKOFF green (item 5 = slice 3, next).

## 2026-07-17 — Session 8 slice 1: motion measured + distance-driven stride (M0 completion, part 1)
- **Corpus**: 7 ffmpeg 60fps windows off the longplays, each VISUALLY
  verified before measuring (kickoff rule) — two kickoff windows were wrong
  and slid: walk-b05a 397s hit a black sector fade, walk-b05b 425s hit the
  FIGHT splash; corrected to 464-468 + probes at 401-497. Corpus manifest +
  every number's provenance: **docs/research/fidelity/MOTION_MEASUREMENTS.md**.
- **Measured** (pixel-difference cadence + fixed-camera foot plants +
  workflow viewer duel-strike-A): the OG animates at **15fps** (strict
  4-video-frame pose cadence, one deliberate 8f clash hold); walk stride
  **16f ≈ 267ms** at ~8.4 px/f ⇒ **stride ≈ 72 stage px**; hit stagger
  **12f (4 upright + 8 bent)**; knockback ~55-70px@1080; strike anatomy =
  windup hold 1 anim step → lunge lands in ONE step (~167-236px) → streak
  4f; TWO gaits (upright walk vs ~45° bounding run ~14 px/f); standing
  sprite ~220px@1080 ≈ 117 stage px (matches our build); combat idle is a
  semi-crouch (poses slice, queued).
- **Built red-first**: `FighterAnimator.update(dtMs, dxPx)` — stride phase
  advances with DISTANCE (3 tests watched RED: antiphase-under-dx,
  retreat-rewind, amplitude pin; then GREEN), idle breath split onto its own
  wall-time phase; DuelScene feeds facing-relative sim dx and latches drawn
  poses at the measured 15fps (`ANIM_TIMING.poseStepMs`, 0 = smooth veto);
  `setMoving` deleted. **Chaos plant**: stride reverted to time-driven → 4
  RED (incl. both tests that had passed vacuously pre-impl) → restored →
  13/13. Test-design catch on improvement pass: sampling with `update(0,0)`
  correctly returns the idle pose — pins now sample the last MOVING update.
- Config: WALK rebuilt (stridePx 72 MEASURED + coarse amplitudes flagged
  for the re-verify pass), hitRecoil 67/return 133 MEASURED, walkPeriodMs
  DELETED (time-driven stride is gone), poseStepMs added — double-entered.
- **Gate paste: suite 444/444 · tsc exit 0 both configs · eslint exit 0 ·
  ratchet refreshed (diff: '0' 54→63, '0.1' dead-zone removed).**
- Limit note: 9 of 10 measurement viewers died on the session cap (resets
  4:50am +08 07-18) — re-measure queue + workflow resume line in the
  ledger. Walk numbers were salvaged inline the same hour (fixed-camera
  strips). Owner asked whether to hand-extract all video frames: NO —
  windows already on disk; full-video extraction is ~250k frames for a
  15fps game.
- OPEN: browser eyeball + fidelity 55/55 re-run, crumple/death + arm
  amplitudes, proportions slice, SESSION9 kickoff at close.

## 2026-07-17 — Session 8 slice 2: deathMs measured + browser verification (M0 completion, part 2)
- **Crumple measured inline** (A one-hit kill t≈3315.5, every-4th-frame
  strip): fatal hit f149 → tip-airborne f153 → ground f165 → settled f173
  ⇒ collapse 20f ≈ 333ms; body knocked BACKWARD rotating horizontal;
  sword detaches and drops (tell, queued). `deathMs` 320→333 MEASURED,
  double-entered. Player death-fall ASSUMED same system (re-run confirms).
- **Browser verification** (Chrome MCP, dev server fresh): VS→FIGHT! intro
  plays; held-D walk shows legs cycling through stride phases while
  translating (two zooms: extended split → passing), invuln blink intact;
  slash → enemy bar drops (defense-shaved 8); kill → hard-cut red beat →
  +10 XP/+8 COINS result → R restart. **Fidelity gate re-run after all
  motion changes: 41 points + 14 scans, 0 failures — 55/55 PASS.** Zero
  console errors from a fresh load (tracking started pre-load).
  The 333ms live collapse outruns MCP screenshot round-trips (~2s) —
  visual eyeball QUEUED for the owner's feel-run; behaviour is unit-pinned
  (death lerp terminal, DEAD render browser-proven at M0).
- **SESSION8B_KICKOFF.md written** (standing end-of-session rule): honest
  bar self-report (items 1/2/5 green; 3 partial — SLASH_FRAMES still
  INFERRED, 9 viewers died on the session limit, reset 4:50am +08 07-18;
  4 recoil/death applied, eyeball queued; 6 not started), ordered
  continuation list with the workflow resume line.
- Gate paste: suite 444/444 (unchanged since slice 1 commit + deathMs pin
  re-run 61/61 targeted) · gate 55/55 in-browser · eslint 0 (pre-commit).

## 2026-07-17 — Session 8B slice 3a: semi-crouch idle applied + master reference adopted (continuation session)
- **Semi-crouch combat IDLE_POSE applied** (commit 22be5de): pelvis +4,
  knees ±9/−8, feet ±14, chest +6 lean, blade hand low-forward — the
  ledger's duel-spawn reading (B t≈426.8). Exact pin RED-PROOFED (stash
  poses.ts → 1 failed | 7 passed → pop → green). Ledger row marked
  APPLIED + RESUME_HERE same-commit.
- **Fidelity gate re-run on the live canvas after the pose change:
  41/41 points + 14/14 scans = 55/55 PASS, overall pass:true. Zero
  console errors across a tracked fresh load.** (First run of the gate
  was discarded — a CDP timeout left run #1 driving the game while
  run #2 probed, so its probes sampled the wrong states; protocol note:
  start the gate ONCE per fresh load, poll `window.__gateResult`.)
- **Proportions composite delivered** (kickoff item 3):
  `<session-784a688d scratchpad>/idle-composite-8b.png` — OG duel-spawn
  crop vs our live fighter. HONEST VERDICT: measured ratios all land
  (height/kasa/stance width/blade pin to the ledger §7.6 within 1-2px)
  and the pose now reads combat-ready — but the OG crouch is visibly
  DEEPER (front knee further forward, more torso coil). Grade B+:
  real step, not yet indistinguishable. Deepening queued behind the
  viewer amplitude data (same joints move).
- **SHSD_MASTER_REFERENCE.md adopted** (commit 530ec62, owner request):
  2,117-line digest compiled by a parallel Claude session from our own
  ledgers + wiki mining; provenance header pins precedence (config pins >
  ledgers > DIVERGENCES > SYNTHESIS > digest) and flags grade-inflation
  spots. Owner also asked about iaido-duel inspiration — already mined
  2026-07-12 (skeleton port = Stage-4 M0, DIVERGENCES adoptions).
- **Measurement workflow relaunched** in the fresh session
  (`wf_466b63b2-966`, 9 assignments, walk-slow DROPPED — bad window;
  cross-session resume impossible, resume is same-session only). First
  attempt died on the session cap again (reset 3:40pm +08), resumed
  after reset — running at close of this entry.
- Gate paste: suite 444/444 · tsc --noEmit ×2 exit 0 · eslint exit 0 ·
  gate 55/55 in-browser · zero fresh-load console errors.

## 2026-07-17 — Session 8B slice 3b + close: viewer results applied, dash-snap discovered
- **Viewer workflow `wf_466b63b2-966` (second attempt after the 3:40pm
  reset): 4 of 9 returned** — duel-approach + strikes A/B/C (5 died on
  the cap again). Their findings: 15fps action latch independently
  re-confirmed ×4; 8f holds confirmed; duels open with a dash (no walk);
  arms WEAPON-LOCKED in all motion; **NEW: attacker translation on a
  dash-slash completes in ONE video frame (~240px @1080), landing pose
  held, streak rendered after arrival** (strike-C, 3 dashes measured);
  knockdown/get-up state (~40f prone); damage-popup kinematics; hit-tint
  7/12/16f family; 30fps locomotion-latch candidate (medium conf,
  re-measure queued).
- **Capped viewers salvaged INLINE the same night**: windowed detrended
  CSV analysis (walk-nw/jog-a28) → walk hat-bob ≈0.9%h, idle bob ≤0.5%h;
  frame reads → death f120-300: player fall CONFIRMED same crumple
  family (backward, weapon detaches, tableau snaps 1 tick at f166,
  settled ≤20f) — the deathMs-applies-to-both ASSUMPTION is now measured.
- **Applied red-first (commit 2c01a31)**: WALK.bob 3→1 · armSwing 7→0
  (weapon-locked; anim.test.ts pin flipped, watched RED on sign) ·
  IDLE_BREATH halved. config-values pins updated FIRST → 2 RED → config
  → 444/444.
- **Close-out verification**: fidelity gate 41/41 + 14/14 = **55/55 PASS
  after the amplitude changes**, zero fresh-load console errors; live
  walk zoom shows mid-stride translation with the blade hand locked
  (invuln blink active — correct).
- **SESSION9_KICKOFF.md written** (headline: dash-through slash — the
  measured 1-frame snap is our biggest remaining motion gap; then crouch
  deepening off the B+ composite verdict; owner feel-run stays queued
  first). RESUME_HERE routed to it, same-commit.
- Gate paste: suite 444/444 · tsc --noEmit ×2 exit 0 · eslint exit 0 ·
  55/55 in-browser · zero console errors.

## 2026-07-17 — Session 9 slice 1: dash-through slash landed (the headline motion gap)
- **`DASH_SLASH_PX = 127` MEASURED → config** (strike-C's three dashes
  +240/+240/−235 px @1080, mean 238.3 ÷ 1.875 = 127.1), double-entered in
  config-values.test.ts. Rule in `Sim.applyStroke`: every fighting-phase
  slash snaps the player 127 px along the stroke's net-x — pass-through
  (constant displacement across all measured dashes ⇒ not stop-at-target),
  arena-clamped, no dash airborne (jump owns position) or zero-net.
  Bounds decisions + veto lines: DIVERGENCES "Session 9 dash-through" block.
- **Red-first receipts**: 6 of 9 new Sim tests watched RED
  (100 ≠ 227 / 300 ≠ 173 / clamp walls / block+miss dash) before the
  implementation; the other 3 are guard pins (airborne / zero-net /
  pre-FIGHT discard) that pin no-dash behavior. **Chaos plant**: clamp
  disarmed → both wall tests RED (player at 1121 / −27, outside the
  arena) → restored → GREEN.
- **Collateral**: `endInvuln` test helper made zero-net (its documented
  job is "end spawn invuln, no side effects" — the dash was a new side
  effect that shifted two kunai-geometry tests); both adapted tests keep
  their original assertions. 24-seed harness green UNCHANGED with
  dash-through live (bot still 24/24 good-play, median in band).
- **Browser proof (real input path)**: drag through the RONIN → sim read
  player x 260 → **387 (exactly +127)**, enemy hp 150 → 142 (exact-8 pin
  intact), spawn-invuln blink ended by the offensive act, streak + blood
  render at arrival. Zoom pair: session scratchpad
  `dash-evidence/dash-before.png` / `dash-after.png`. Landing hold =
  existing SLASH_FRAMES recovery pose (maps to the OG's 4–12f hold).
- **Fidelity gate 41/41 + 14/14 = 55/55 PASS on a fresh load with the
  dash live; zero fresh-load console errors** (occlusion note: back-to-
  back __fidelity.run() calls froze the tab — reloaded, single clean run).
- Ledgers same-commit: MOTION_MEASUREMENTS dash row → "landed in config
  (Session 9)"; TELLS row 37 (post-spec measured tell); CALIBRATION
  row 18; DIVERGENCES Session-9 block (incl. the knowing windup-0
  divergence + PLAYER-ONLY deferral of enemy dash).
- Gate paste: suite 454/454 · tsc --noEmit ×2 exit 0 · eslint exit 0 ·
  55/55 in-browser · zero fresh-load console errors.
- **Adversarial review workflow `wf_d357ea3c-cb1` (13 agents, 3 lenses +
  per-finding refuters): 6 CONFIRMED / 4 refuted.** Confirmed + fixed
  red-first, all in the same slice-1 commit:
  (1) MAJOR no rate limit — scribble-spam teleported (refuter repro: 8
  micro-slashes crossed the arena at frame 0); fix = one dash per
  SLASH_FRAMES swing cycle (the measured strike-to-strike interval,
  sim-frame counted so Shunpo can't amplify), damage untouched. Browser
  re-proof: spam strokes 2-4 held x=387, next slash after one 16f cycle
  dashed exactly +127 (387→514).
  (2) minor >2040px there-and-back stroke dashed (resample truncation
  bias) — DrawnStroke.direction now reads the TRUE drawn endpoints
  (RED-watched on the 2200px repro).
  (3) minor ~5px slip dashed 127px — DASH_MIN_STROKE_PX=40 INFERRED gate
  (RED-watched).
  (4) minor provenance tilde ("+~240") restored in both comment sites.
  (5)+(6) MAJOR test-lens mutation gaps — airborne-discard-everything and
  direction.x-component-scaling mutants both survived the suite; new pins
  added and PROVEN by planting each mutant (both bit: airborne test RED,
  diagonal test RED) then restoring.
  Refuted (evidence in the workflow journal): ledger-not-updated (it was,
  mid-review), constant-magnitude inference, windup-anatomy divergence
  (already a logged DIVERGENCE), vertical-slash guard comment (vertical
  strokes never classify 'slash').
- Post-hardening gate paste: suite **460/460** · tsc ×2 exit 0 · eslint
  exit 0 · fidelity 41/41 + 14/14 = 55/55 · zero console errors ·
  rate-limit + slip-gate proven live via the occlusion loop-step seam.

## 2026-07-17 — Session 9 slice 2 + close: crouch coil deepened (B+ → A−)
- **Grade-inflation catch first**: the master digest's §7.6 claim "knee
  bend: code = 157.1° ✓ exact" is FALSE — its math assumed a zig-zag leg
  (thigh forward, shin back) but the 8B pose ran BOTH segments forward:
  true interior angle ≈176° (nearly straight). The OG's measured read
  (§7.3: thigh ~9° fwd, shin ~15° back) is a real zig-zag. That mismatch
  IS the "OG reads deeper" the B+ composite saw. Also verified: the legs
  are hakama-occluded in the spawn frame — the digest's knee-row reads
  can't be direct joint observations; the ~157° stays an estimate, so
  the pin is a 150–160° band, not an exact assert.
- **Applied red-first**: new "coil depth" pin in skeleton.test.ts
  (knee-at/past-toe + computed interior angle 150–160° + chest >7 +
  UNCHANGED height-envelope/stance-width guards) → watched RED (knee 9 <
  toe 14) → poses.ts deepened: kneeF 9→15 (interior ≈154.7°), kneeB
  −8→−11 (back leg raked), chest/neck 6→9, head 7→10, hat 8→11,
  arm chain +2 (shoulder 11, elbow 18, hand 19, sword 60). Heights and
  feet untouched — depth is x-offsets only, exactly the kickoff contract.
- **Composite re-delivered**: `<dd8b86c7 scratchpad>/idle-composite-9.png`
  (OG duel-spawn crop vs live fighter, fresh browser zoom). HONEST
  VERDICT: **A−** — the coil reads (head/kasa stacked over the front
  hip, knee past the toe, raked back leg, low mass). Remaining nameable
  gap: the OG kasa TILTS with the head pitch, ours sits level — that is
  drawSamurai art polish (queued, discretionary), plus the deliberate
  hakama-vs-exposed-legs build-style divergence.
- Gate paste: suite **461/461** · tsc --noEmit ×2 exit 0 · eslint exit 0
  · fidelity 41/41 + 14/14 = **55/55** on the pose-change load · zero
  console errors.
- Session 9 bar self-report: items 2–5 GREEN (dash landed+hardened,
  crouch deepened+re-verdicted, all pastes in); item 1 (owner feel-run)
  stays OPEN — human eyes queued; discretionary viewers NOT run (quota
  spent on the 13-agent review instead — better trade).

## 2026-07-18 — OWNER FEEL-RUN VERDICT (gate item 1 CLOSED) → control-model correction
- **Kheshav played the build and returned the deepest correction the
  project has had — the CONTROL MODEL is wrong.** His verdict (recorded
  as the highest-precedence measurement — he played the OG):
  (1) the OG has NO WASD — movement is mouse-only, click the screen to
  move; (2) the drawn line does NOT itself damage — it is a TARGETING
  command: the character RUNS to the drawn line, then slashes that AREA,
  damaging enemies inside it (today we damage from any distance without
  approaching — wrong); (3) damage far too low; (4) crit bar fills too
  slowly; (5) stances feel inert; (6) AUTO SLASH does nothing;
  (7) rebuild step-by-step following the longplay's actual opening
  sequence (title → loading → walk → first enemies → helper-character
  tutorial beats).
- **SESSION10_KICKOFF.md REWRITTEN around the verdict** (knockdown/
  hit-tint kickoff superseded — git history at 0445773). Ordered: study
  pass (click-to-move anatomy, command-slash end-to-end incl. trigger
  range + slash-area extent, damage popups/hits-to-kill, crit-fill time,
  stance visible deltas, AUTO SLASH behavior, opening-flow shot list) →
  Sim control model red-first (click-to-move + queued slash COMMANDS:
  approach → lunge → resolve-at-arrival) → feel re-seed from
  measurements → AUTO SLASH honest → campaign flow scoped for S11+.
- **What survives**: the measured lunge (127px 1-frame snap, streak
  after arrival, swing-cycle rate limit) becomes the corrected command's
  final approach step; walk/run gaits become its travel step; all
  pose/timing work unaffected. Naming (OG cast referenced by owner)
  logged as an OPEN DECISION — default stays original names per the
  root invariant, owner-vetoable like the palette.
- No code this turn — the new session executes the kickoff.

## 2026-07-25 — SOURCE DIVE: the protection is broken, the payload is mined

**Outcome: the archived *Straw Hat Samurai: Duels* client is decrypted,
decompiled and mined. Build confirmed v0.717 — the same build our video
measurements came from.** No gameplay code changed. Suite 464/464, tsc ×2
exit 0, eslint 0. Ledger: `docs/research/fidelity/SOURCE_CONSTANTS.md`.

**The crack — three layers, none needing the dead Player.IO server.**
`SOURCE_DIVE_KICKOFF.md` §6 called Tier 2 a coin flip whose fatal case was a
server-delivered key. It wasn't:
1. `shs3.swf`'s 2,390-byte `lb` class RC4s an embedded blob using **the blob's
   own last 8 bytes** as the key, and encrypts **only the first 64 bytes**.
2. That yields SWF Defender (magichtml.com) — config header carries the key
   `ZvupTBlC` in the clear; `Comp.C1` is repeating-key XOR, `Comp.C2` is RC4.
3. That yields the real tinyloader, whose payload transform is five lines:
   `for (i=3;i<256;i++) { if (i%11==0) swap(b[i],b[i+256]); b[i] ^= 104; }`.
   Bytes 0–2 untouched — which is exactly why the archived file kept a readable
   `CWS` signature with a nonsense version byte and read as corrupt, not encrypted.

Proof, computed not asserted: the decoded SWF's declared length matches its
inflated body **to the byte** on both the desktop (11,892,061 = 11,892,053 + 8)
and android (21,688,592 = 21,688,584 + 8) payloads. Reproducible via three
scripts in `reference/tools/`. ffdec 26.2.1 installed as an accelerator only.

**Mining: 6 agents → 6 adversarial verifiers → 1 lineage agent.
152 CONFIRMED · 37 CORRECTED · 0 REFUTED.** The verify pass paid for itself —
it caught a dead `×2` damage path, an inverted camera reading, a missed second
dash leg, the mastery cap, and **the entire 495-row enemy stat table** that the
miner had written off as permanently server-side.

**Our values confirmed exactly:** `CRIT_MULT = 1.3` · `HEAVY_DEF_PENALTY` as
`defense × 0.8`, defender-side, heavy-only (the Stage-2 "apply ONE, never both"
landmine vindicated) · damage is a roll · damage does not scale with level ·
the stance triangle and its ×1.2/×0.9.

**Measurement vindicated:** Focus measured 5.97 s; the source meter is 192 units
at +1/frame (8.000 s) but the **bar renders `(current−48)/144`** → 6.000 s
visible. The hidden 48 also explains the refuted "−20 %/slash" rule. Mobs die in
one hit — `<hp>1</hp>` authored *and* forced by `setLevel`. **JINBEI's 132 HP
falls out of the formula exactly**: named-enemy HP is recomputed from the
*player's* stats so a fight lasts K hits, K clamps to 3, and 3 × 44 = 132 where
44 is the mean of the measured 42/48/42.

**Four project beliefs refuted** (DIVERGENCES "Source dive"): `COUNTER_BONUS`
models a mechanic that does not exist (the forum's ~20 % is the stance triangle)
· `STANCE_TABLE.reach 300/200/100` is wrong *in kind* — reach is a stat-driven
**arc-length budget of the drawn stroke**, `200` is a placeholder default, and
300/200 are also the SHS1/SHS2 constants which disagree with each other by 50 %
· combo resets to **0 on damage**, never on a kill, and is purely cosmetic ·
in-combat stance switching costs **48 focus**.

**Both "UNRESOLVABLE" items answered:** AUTO SLASH ON hands the player's fighter
to the **enemy AI routine** and locks out manual input entirely · the enemy stat
table was recovered from the **android** build (0.682), which ships embedded what
the desktop fetches from a host confirmed never archived. Also recovered: 61
quests, 982 items, 75 skills.

**Two placeholder traps caught and recorded** so they are not re-adopted: the
static UI mockups (`slash distance: 345 (heavy)`, `physical dmg: 1234 - 1235`)
and `maxDistance = 200`. Left deliberately unconverted: the walk/run
stage-px-vs-world-px render scale (≈1.2 fits but is unconfirmed),
`SLASH_FRAMES` (anim XML has a loop flag and two naming families), and
`DASH_SLASH_PX` (not a constant — two uncapped dash legs).

Nothing SWF-derived is committed; `git check-ignore` verified on every derived
path. Next entry point: `SESSION12_KICKOFF.md`, after `SOURCE_CONSTANTS.md` §5–§6.
