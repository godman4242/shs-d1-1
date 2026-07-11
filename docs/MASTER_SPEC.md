# MASTER SPEC — Straw Hat Samurai: Duels 1:1 (verbatim kickoff)

> **Provenance:** this is the original session kickoff (Stage 0 session,
> 2026-07-11), recovered verbatim from the session transcript and committed so
> no future session depends on a chat log. The spec body below is the
> CONTRACT — do not edit it; corrections belong in the errata block.
>
> **Kheshav's standing instruction (verbatim, from the same kickoff):**
> "this is what i am building the goal is one to one, if you feel like there
> is a contradiction and that you can make the exact game better please
> research make sure you are correct instead of going to memory and
> implement, so mistakes are not made, do not be a yes man"
>
> **ERRATA — spec values already corrected in the repo (evidence-backed;
> the spec text below still shows the old values):**
> - `CRIT_MULT = 3` → **1.3** in `src/config/combat.ts` (research: Fandom
>   Stances page; see `docs/research/original-game-facts.md`). Stage 2's
>   "crit 3×" gate items read as "crit ×CRIT_MULT".
> - `MAX_DAN_RANK = 5` → **10** queued for Stage 3 (research; spec's own
>   `tenthGold` corroborates).
> - Rebirth "+10 Attack" → **+10 chosen elemental skill points, stacking**
>   queued for Stage 3 (research + video A-17 Rebirth Scroll text).
> - `KILL_REWARD = {xpPerFoeLevel:10, ...}` → keep INFERRED: 20+ video
>   samples show NO flat formula (SYNTHESIS §1.2).
> - Stage 2 landmine: apply `HEAVY_DEF_PENALTY` (DEF ×0.8) OR
>   `damageTakenMult 1.25` — ONE, never both (research + video A-14).
> - `DUEL_TARGET_SECONDS {20,60}` fits bosses/PvP; PvE trash observed at
>   3–10 s (SYNTHESIS §1.1) — Stage 2 tuning input, not a spec change.
> - Full research/video cross-check: `docs/research/original-game-facts.md`
>   + `docs/research/video-study/SYNTHESIS.md` §5–§7.

---

You are building a from-scratch, original-asset recreation of the Flash game
"Straw Hat Samurai: Duels" by LutGames / Explosive Barrel. The game died with
Flash in January 2021. Goal: 1:1 recreation, indistinguishable from the original.

ABSOLUTE RULE: RECREATE, NEVER RIP. No decompiled code, no extracted art, no
ripped audio. Everything is drawn/synthesized from scratch. Reference videos
are study-only, gitignored, never distributed.

═══════════════════════════════════════════════════════════════════
TECH STACK (fixed, not negotiable)
═══════════════════════════════════════════════════════════════════
- Phaser 3 + TypeScript + Vite
- Vitest for unit testing (TDD)
- WebAudio synthesized SFX only
- Procedural vector art only (drawn in code, no image files)
- src/core/ = pure framework-free combat math, fully unit-tested
- src/config/ = all gameplay numbers (config-purity test enforced)
- Phaser scenes = render-only, never own gameplay state
- Fixed 60Hz timestep (FIXED_HZ=60), injected mulberry32 RNG (no Math.random
  in core/)

═══════════════════════════════════════════════════════════════════
FOLDER RULES (nested context — prevent context-failure mistakes)
═══════════════════════════════════════════════════════════════════

src/core/   — Pure framework-free combat math. NO Phaser imports. ZERO
              numeric literals (config-purity test enforces this).
src/config/ — Pure data exports. NO logic, NO Phaser imports. Every
              gameplay number lives here, labeled CONTRACT or INFERRED.
src/game/   — Phaser scenes ONLY. Render-only — never own gameplay state.

Dependency direction: core/ → config/ → game/. Never reverse.
Config-purity: core/** held to ZERO violations; game/** ratcheted against
a committed per-file value multiset (fails on new/substituted values).

═══════════════════════════════════════════════════════════════════
STAGE 0 — SCAFFOLD (binary-done: project boots, tests run, purity enforced)
═══════════════════════════════════════════════════════════════════

Produce:
  1. Vite + Phaser 3 + TypeScript project that compiles with zero errors
  2. Vitest configured with at least one passing placeholder test
  3. src/core/ directory with a Sim class (empty but typed) and an
     OpponentController interface
  4. src/config/palette.ts exporting a COL object with these EXACT hex values
     (all INFERRED seeds from actual palette.ts):
       skyTop 0xd6dbf0, skyLow 0xeef0ff, bladeChi 0x72c4ea (SHIFTED +2 hue for trade dress distance)
       forestBright 0x4aa433, forestMid 0x30942f, forestMid2 0x33a130,
       forestShadow 0x1f7532, forestDark 0x163012, sage 0x64905f,
       canopy 0x7fa443, trunk 0x0a2228
       kimono 0xf3f3eb, kimono2 0xe9eddb, haori 0x2d3d60,
       haoriShade 0x1c2945, hair 0x241f1b, hatStraw 0xbc9552,
       wood 0x794802, outline 0x040304
       blood 0xa50103, bloodDark 0x950202, bloodBright 0xc81a10
       healthGreen 0x5cbf2f, focusBlue 0x3d80d6, gold 0xeaa83c,
       buttonRed 0x902010, cream 0xefedc2, goldTrim 0xc8a44e
       haoriEnemy 0x6d2030, scarf 0xc94730
  (NOTE: These are SHIFTED ±5-8% HSL from the original seeds — same mood, not identical
   pixels. This is the cheapest insurance against trade dress claims per §2 adversarial
   analysis. Do NOT use the unshifted palette values — the adversarial section explicitly
   warns that identical palette + identical mood = risk.)
  5. src/config/combat.ts with these values (core constants — non-exhaustive,
     see the actual config files for the full list):
       CRIT_MULT = 3 (CONTRACT)
       COUNTER_BONUS = 1.25 (INFERRED)
       HEAVY_DEF_PENALTY = 0.2 (CONTRACT)
       DAMAGE_FLOOR = 1 (CONTRACT)
       CHI_PUNCH_DMG_L1 = 10 (CONTRACT)
       SPAWN_INVULN_S = 5 (CONTRACT)
       FOCUS_MAX = 100, FOCUS_SWITCH_COST = 34, FOCUS_START = 50 (INFERRED)
       CRITICAL_MAX = 100, CRITICAL_FILL_PER_S = 8 (INFERRED)
       WEAPON_WEIGHT = { light: 1.0, balanced: 1.5, heavy: 2.5 } (INFERRED)
  6. src/config/stances.ts with STANCE_TABLE:
       light:    { reach: 300, speed: 1.4, dmgMult: 0.9,  damageTakenMult: 1.0  }
       balanced: { reach: 200, speed: 1.0, dmgMult: 1.2,  damageTakenMult: 1.0  }
       heavy:    { reach: 120, speed: 0.7, dmgMult: 1.4,  damageTakenMult: 1.25 }
       STANCE_BEATS = { light: 'heavy', heavy: 'balanced', balanced: 'light' }
       LAUNCH_UNLOCK_LEVEL = { light: 3, balanced: 5, heavy: 5 }
  7. src/config/timing.ts with:
       FIXED_HZ = 60
       SLASH_FRAMES = {
         light:    { windup: 4,  active: 3, recovery: 8  },
         balanced: { windup: 6,  active: 3, recovery: 12 },
         heavy:    { windup: 10, active: 4, recovery: 16 }
       }
  8. A config-purity test that scans src/core/ for numeric literals and
     fails if any are found (zero-tolerance for core/)

VERIFICATION GATE (all must pass):
  ☐ tsc --noEmit exits 0
  ☐ npm test passes (≥1 test)
  ☐ config-purity test: zero numeric literals in src/core/
  ☐ palette.ts exports the exact hex values listed above
  ☐ combat.ts exports the exact constants listed above
  ☐ stances.ts exports STANCE_TABLE with exact values + STANCE_BEATS
  ☐ timing.ts exports SLASH_FRAMES with the per-phase structure above

═══════════════════════════════════════════════════════════════════
STAGE 1 — SLASH ENGINE (binary-done: blade traces drawn path, damage works)
═══════════════════════════════════════════════════════════════════

Produce in src/core/:
  1. vec.ts — 2D vector math (add, sub, dot, cross, len, norm, lerp, dist)
  2. geometry.ts — point-in-polygon, line-segment intersection, polyline
     closest-point, distance from point to polyline
  3. DrawnStroke.ts — takes raw mouse points, resamples to uniform spacing
     (RESAMPLE_SPACING=8, SMOOTH_ITERATIONS=2, CHAIKIN_RATIO=0.25,
     MAX_STROKE_POINTS=256 — from config/combat.ts), applies Chaikin smoothing
     (2 iterations), computes length, direction, and classifies gesture:
     horizontal→slash, up→jump, up-flick→launch, down→stab.
     Guard against NaN/Infinity (clamp to 0, bail to endpoints).
  4. slash.ts — resolveSlash(stroke, targetHitbox) returns:
     { hit: boolean, damage: number, crit: boolean, severed: string[] }
     Damage = (ATK+Weapon) × STANCE_TABLE[stance].dmgMult × (crit?CRIT_MULT:1) × counter
     Counter: if STANCE_BEATS[attacker]===defender, ×COUNTER_BONUS (1.25), else 1
  5. stance.ts — Stance enum (light/balanced/heavy), counter triangle logic
  6. gesture.ts — classifyGesture(points) → "slash"|"jump"|"launch"|"stab"

Produce in src/config/:
  7. fx.ts — SLASH_ARC = { bodyHalfWidth: 26, coreHalfWidth: 11, taperPow: 1.6,
     minTaper: 0.1, hangMs: 200, fadeMs: 180 }
     BLOOD_FX = { burstCount: 12, burstCountSevered: 20, speedMin: 90,
     speedMax: 280, poolSpreadRadius: 46, poolSpreadMs: 2600, poolAlpha: 0.9 }
     FINISHER_FLASH = { durationMs: 420, snapInMs: 60, slowMoScale: 0.35,
     slowMoRampMs: 90 }
  (NOTE: blade trail constants BLADE_CORE_WIDTH=7, BLADE_EDGE_WIDTH=13,
   BLADE_FADE_MS=200, BLADE_MIN_TAPER=0.12 live in config/combat.ts.
   BLOOD_COUNT=9, BLOOD_COUNT_SEVERED=16, BLOOD_SPREAD_DEG=42,
   BLOOD_SPEED_MIN=60, BLOOD_SPEED_MAX=240 also live in config/combat.ts.
   Do NOT create BLADE_WIDTH or BLOOD_PARTICLES — those don't exist.)

Produce in tests/:
  8. Unit tests for vec, geometry, DrawnStroke (including overflow input),
     slash (including crit, counter, multi-foe), stance triangle, gesture
  9. A chaos test that feeds ±1e308 coordinates to DrawnStroke and asserts
     all output points are finite

Produce in src/ (Phaser scene):
 10. A DuelScene that renders a 1024×576 letterboxed canvas, draws a forest
     background using palette colors (multi-layer parallax: sky, mountains,
     mid silhouettes, foreground band), renders a simple fighter capsule,
     captures pointer drag, creates a DrawnStroke, resolves it against the
     fighter, renders a two-layer blade trail (white core + colored edge,
     pinched tips), and sprays directional blood on hit.

VERIFICATION GATE (all must pass):
  ☐ All unit tests green (≥30 tests)
  ☐ Chaos test: overflow input → finite output (proven by reverting guard = red)
  ☐ tsc --noEmit exits 0
  ☐ npm run dev opens a page with a forest background and a fighter
  ☐ Drawing a line across the fighter produces a blade trail and blood spray
  ☐ Drawing a line up makes the fighter jump (start.x → end.x, arc)
  ☐ Damage is HP-based (not instant kill): 100 HP foe takes partial damage
  ☐ Blade trail is two-layer (white core visible inside colored edge)
  ☐ Blood sprays in the direction of the cut (right→0°, left→180°)
  ☐ config-purity still clean (zero literals in core/)

═══════════════════════════════════════════════════════════════════
STAGE 2 — FULL COMBAT (binary-done: all systems functional, duel is playable)
═══════════════════════════════════════════════════════════════════

Produce in src/core/:
  1. Sim.ts — fixed 60Hz deterministic tick. advance(deltaMs) clamps to
     MAX_FRAME_MS=250, ignores NaN/negative. Owns: damage resolution, Focus
     drain/fill, Critical bar, stance switching + Focus cost, spawn invuln
     (5s or first slash), Smoke Bomb i-frames, Stab+Deflect, Chi Punch (10
     dmg at L1), projectile (kunai) system, Shunpo (SHIFT-hold slow-mo),
     kill beat (freeze + timescale ramp). Consumes PlayerIntent and
     OpponentIntent. Emits SimEvent[] (typed events for FX/SFX).
  2. AISeamController.ts — produces OpponentIntent. Telegraph-then-commit
     pattern: windup ≥ telegraphMs before any strike. Stance switches queue
     pendingStanceMs (telegraph flash). Kunai thrown at range 240-720px
     (Normal+ tier). Uses injected rng (mulberry32), never Math.random.
  3. critical.ts — Focus bar: fills in combat, 3× crit payout, drains on
     stance switch (more for heavier weapons). Unit-tested.
  4. combo.ts — combo counter, escalates with consecutive hits.
  5. projectile.ts — kunai entity, velocity, hit resolution, deflectable.
  6. trajectory.ts — jumpArcPoint(t, start, end, apex) pure function.
  7. save.ts — seed serialization for replay (optional).

Produce in src/config/:
  8. ai.ts — AI_TIERS (use these EXACT values and property names):
       AITierParams interface: { telegraphMs, attackMs, recoverMs, reactMs,
         reactBlockChance, reactDodgeChance, counterStancePickChance,
         aggression, kunaiChance }
       easy:   { telegraphMs: 700, attackMs: 180, recoverMs: 760, reactMs: 420,
                 reactBlockChance: 0.15, reactDodgeChance: 0.05,
                 counterStancePickChance: 0.2, aggression: 0.3, kunaiChance: 0 }
       normal: { telegraphMs: 520, attackMs: 180, recoverMs: 620, reactMs: 320,
                 reactBlockChance: 0.30, reactDodgeChance: 0.15,
                 counterStancePickChance: 0.5, aggression: 0.55, kunaiChance: 0.25 }
       hard:   { telegraphMs: 380, attackMs: 160, recoverMs: 480, reactMs: 220,
                 reactBlockChance: 0.45, reactDodgeChance: 0.25,
                 counterStancePickChance: 0.8, aggression: 0.8, kunaiChance: 0.40 }
       AI_KUNAI_RANGE = { min: 240, max: 720 }
       AI_STRIKE_RANGE = 132, AI_APPROACH_RANGE = 620, ENEMY_SPEED = 0.17
       AI_RECOVER_JITTER_FRAC = 0.35
       DUEL_TARGET_SECONDS = { min: 20, max: 60 }
  9. combat-sim.ts — MAX_FRAME_MS=250, SHUNPO_TIMESCALE=0.35, SHUNPO_MAX=100,
     SHUNPO_DRAIN_PER_S=34, SHUNPO_MIN_TO_START=10,
     SMOKE_BOMB_DISTANCE=180, SMOKE_BOMB_IFRAMES_MS=420,
     DEFLECT_WINDOW_MS=260, DEFLECT_RADIUS=64,
     PROJECTILE_SPEED=0.55, PROJECTILE_DMG=8, PROJECTILE_HIT_RADIUS=26,
     PROJECTILE_MAX_ACTIVE=8,
     PLAYER_MOVE_SPEED=0.28, PLAYER_WINDUP_MS=0,
     PLAYER_BASE={hp:100, atkPlusWeapon:10, defense:5, stance:'balanced', deflectLearned:true},
     ENEMY_BASE={hp:150, atkPlusWeapon:7, defense:5, stance:'heavy', deflectLearned:false},
     SKILL_VERB={1:'chiPunch', 2:'smokeBomb', 3:'stab'}
 10. economy.ts — KILL_REWARD={xpPerFoeLevel:10, coinsPerFoeLevel:8}
     (coins is 8, NOT 5 — verified from actual economy.ts)
     LEVEL_UP_REWARD={skillPoints:1, statPoints:3, fullRefill:true}
     FIRST_RUN_SP_CAP=80, MAX_DAN_RANK=5
     REBIRTH={earlyGold:25, tenthGold:100, lateGold:25, attackBonusPerRebirth:10}
     WAR_ROOM={unlockLevel:10, killCap:350, buildDonationCap:500,
       deployMods:{fieldToMountain:60,mountainToMountain:100,fieldToForest:75},
       controlPointFlagBonus:1.2}
     HAS_CASH_PURCHASE=false

Produce in src/ (Phaser scenes):
 11. DuelScene — render-only. Builds PlayerIntent from input, calls
     Sim.advance(delta × sim.timeScale), drains SimEvents into FX/SFX,
     copies sim state onto render puppets. Renders: VS splash → name
     banner → READY → FIGHT! intro, floating name/health bars, stance
     portrait (bottom-left, click to swap), HP green bar + Focus blue bar,
     skill bar (bottom, numbered 1/2/3), Coins top-left, XP bar top-right,
     Victory/Defeat screen with rewards. Slow-mo applies time.timeScale +
     tweens.timeScale together, restored on kill beat, scene shutdown,
     and in create() (no stuck timescale on restart).
 12. DuelIntro — VS splash, opponent name banner, READY, FIGHT! countdown.
     Clicking fast-forwards. Strokes before FIGHT! are discarded.
 13. DuelResult — Victory/Defeat screen, XP/Coins display, R to restart.

Produce in tests/:
 14. Sim.test.ts — full combat scenarios: stance triangle counter, crit 3×,
     Focus drain on switch, spawn invuln 5s + first-slash end, smoke i-frames,
     stab deflects projectile, chi punch 10 dmg, shunpo drains meter,
     kill beat fires exactly once, AI telegraph ≥ telegraphMs, AI stance
     switch telegraphs, 24-seed harness (good-play 100% win, no-play 0%,
     median ∈ [20,60]s, ≥22 distinct durations).
 15. config-purity baseline audit for src/game/ (per-file value multiset,
     fails on new/substituted values, allows removals).

VERIFICATION GATE (all must pass):
  ☐ ≥200 unit tests green
  ☐ Sim is deterministic: same seed + intents = same result (cross-process)
  ☐ tsc --noEmit exits 0
  ☐ npm run dev → ?scene=duel → playable duel
  ☐ VS → name banner → READY → FIGHT! plays in order
  ☐ Drawing across enemy → slash → blood → damage
  ☐ SPACE swaps stance, drains Focus (visible blue bar drop)
  ☐ Crit produces 3× damage (verify A/B: same hit with/without crit)
  ☐ SHIFT-hold → slow-mo (timescale changes, meter drains)
  ☐ R restarts cleanly (no stuck timescale, no leaked state)
  ☐ Enemy telegraphs before attacking (visible windup ≥ 520ms on Normal)
  ☐ Enemy throws kunai at range (back off with A → kunai flies)
  ☐ Stab (down-stroke or key 3) swats kunai
  ☐ Victory screen shows XP +10, Coins +8 (NOT +5)
  ☐ Defeat screen shows 0/0
  ☐ Spawn invuln: 5s blink, ends on first slash
  ☐ 24-seed harness: 100% win good-play, 0% win no-play, median ~24.7s
  ☐ config-purity: core/ zero literals, game/ baseline clean

═══════════════════════════════════════════════════════════════════
STAGE 3 — PROGRESSION (binary-done: level-up, currencies, stats work)
═══════════════════════════════════════════════════════════════════

Produce in src/core/:
  1. progression.ts — levelUp(player): +1 SP, +3 stat, full HP/Chi/AP refill.
     Rebirth: +10 Attack per rebirth, stacking. First-run 80 SP cap.
     Max dan rank 5 (kyudan).

Produce in src/config/:
  2. economy.ts expanded — Coins (grindable) + Gold (earnable/cosmetic).
     No cash purchase path (HAS_CASH_PURCHASE=false). Rebirth payout schedule.

Produce in tests/:
  3. progression.test.ts — level-up produces exactly +1 SP, +3 stat, full
     refill. Rebirth +10 Attack stacks. 80 SP cap enforced. Dan rank 5 max.

VERIFICATION GATE:
  ☐ Unit tests green for progression
  ☐ Level-up: +1 SP, +3 stat, full HP/Chi/AP refill (exact)
  ☐ Rebirth: +10 Attack, stacks N times
  ☐ 80 SP cap enforced
  ☐ Dan rank 5 is max
  ☐ Two currencies, no cash path

═══════════════════════════════════════════════════════════════════
STAGE 4 — CAMPAIGN (binary-done: story, towns, NPCs, quests, title)
═══════════════════════════════════════════════════════════════════

Produce:
  1. Title sequence with brush-stroke logo (red on parchment)
  2. Dialogue system (ornate gold-cornered frames, white serif caps)
  3. Town scene with NPCs (walk-around, talk, accept quests)
  4. Quest system (accept, track, complete, reward)
  5. RPG screens (character sheet, equipment, inventory, skills)
  6. 3-line haiku title cards between episodes
  7. Season > Prologue/Episode nesting

  CHARACTER/CLAN NAMES (1:1 version — requires LutGames permission):
  - Clans: Aka Ryu (red dragon, invaders), Midori Ken (green sword,
    defenders), Shira Tancho (white crane, neutral)
  - Characters: Hiroshi (tutorial master), Masahiro, Daichi, Takeru,
    Ito (dojo master), Takahasi (mining camp)
  - Story: Aka-Ryu invading through forested mountain pass, player
    must find a route through and stop the invasion

VERIFICATION GATE:
  ☐ Title screen renders with brush-stroke aesthetic
  ☐ Dialogue appears in gold-cornered parchment frames
  ☐ Town scene: walk around, talk to NPCs, accept quests
  ☐ Quest tracking works (accept → objective → complete → reward)
  ☐ Character sheet shows stats, equipment, skills
  ☐ Haiku cards appear between episodes (3 lines, brush style)
  ☐ Season > Episode nesting functional
  ☐ Prologue serves as tutorial

═══════════════════════════════════════════════════════════════════
STAGE 5 — WAR ROOM (binary-done: clan strategy AI works)
═══════════════════════════════════════════════════════════════════

Produce:
  1. Territory map (sectors, borders, ownership colors)
  2. Rival-clan strategic AI (greedy: reinforce weakest border, attack
     adjacent weaker enemy, build when Captain+ and flush)
  3. Deploy troops (+60/+100/75), flag bonus +120%, level-10 gate
  4. Kill cap 350, build cap 500

VERIFICATION GATE:
  ☐ Territory map renders with correct ownership colors
  ☐ AI moves per greedy strategy (reinforce, attack, build)
  ☐ Kill cap 350 enforced
  ☐ Build cap 500 enforced
  ☐ Level-10 gate blocks access below level 10
  ☐ Deploy values: +60/+100/75, flag +120% (exact)

═══════════════════════════════════════════════════════════════════
STAGE 6 — POLISH (binary-done: audio, feel, UX)
═══════════════════════════════════════════════════════════════════

Produce:
  1. Four-way slash SFX: draw (slashStarted), whiff (missed),
     flesh (hitLanded), armor (blocked). Synthesized via WebAudio.
  2. Menu/exploring music separate from combat bed
  3. Victory + defeat stings
  4. Heavy-vs-light tone difference in slash SFX
  5. Feel tuning pass: slash weight, duel pacing, slow-mo ramp
  6. Difficulty curves per AI tier
  7. Background density (foliage layers, atmospheric depth)
  8. Brush display font for titles/haiku

VERIFICATION GATE (human pass required):
  ☐ Four SFX fire on correct frames (draw/whiff/flesh/armor)
  ☐ Heavy slash sounds different from light slash
  ☐ Menu music ≠ combat music
  ☐ Victory sting ≠ defeat sting
  ☐ Slash feels weighty and satisfying (human judgment)
  ☐ Duel pacing 20-60s on Normal (human judgment)
  ☐ Slow-mo kill beat feels cinematic (human judgment)
  ☐ Backgrounds feel dense and atmospheric (human judgment)

═══════════════════════════════════════════════════════════════════
FIDELITY TELLS (the acceptance gate — 100% PASS = done)
═══════════════════════════════════════════════════════════════════

Each tell is binary PASS/FAIL observable in the running build:

SLASH ENGINE:
  ☐ 1. Stroke → smooth swept curve (not jagged polyline, not canned anim)
  ☐ 2. Blade trail = two-layer tapered ribbon (white core + colored edge)
  ☐ 3. Horizontal=slash, up=jump, up-flick=launch, down=stab
  ☐ 4. Jump starts at line start, ends at line end
  ☐ 5. HP-based damage (not instant kill), one line damages multiple foes
  ☐ 6. Per-stance arcs differ (Light long/fast, Heavy short/slow)

COMBAT:
  ☐ 7. Critical bar drains per swing (heavy>light), pays as 3× crit
  ☐ 8. Stance swap costs Focus, triangle Light>Heavy>Balanced>Light holds
  ☐ 9. 5s spawn invuln, blinking, ends on first slash
  ☐ 10. Smoke Bomb dodge + Stab+Deflect projectile swat work
  ☐ 11. PvE foes move slowly, granting charge time
  ☐ 12. Chi Punch = 10 dmg at L1

AI/FEEL:
  ☐ 13. AI attacks telegraph ≥ telegraphMs before landing
  ☐ 14. Normal duel winnable+losable, ~20-60s
  ☐ 15. Kill/finisher beat (freeze + speed-ramp) fires, distinct from Shunpo
  ☐ 16. Shunpo slow-mo drains power meter

ART:
  ☐ 17. Flat-color + bold-outline vector look (Samurai Jack style)
  ☐ 18. Iconic kasa + katana + scarf silhouette, correct proportions
  ☐ 19. Blood sprays directionally along cut, saturated red
  ☐ 20. Scarf/hat secondary motion in idle/move
  ☐ 21. Simple parallax arenas, high-contrast fighters

UI/AUDIO:
  ☐ 22. Camera framing/tracking matches reference
  ☐ 23. Portrait LEFT, coins TOP-LEFT, XP+minimap TOP-RIGHT, skill bar 1/2/3
  ☐ 24. HUD bar colors/shapes/fill match reference
  ☐ 25. VS splash + name banner + result screen
  ☐ 26. Title typography (brush display) + HUD body face match
  ☐ 27. Menu music ≠ combat, distinct victory/defeat stings
  ☐ 28. Four-way slash SFX fire on measured frame

PROGRESSION/LORE:
  ☐ 29. Level-up = +1 SP, +3 stat, full refill
  ☐ 30. Rebirth payout + +10 Attack/rebirth stacking
  ☐ 31. 80 SP cap, max dan rank 5
  ☐ 32. Coins grindable, Gold earnable, no cash purchase
  ☐ 33. Season>Episode nesting, Prologue=tutorial, 3-line haiku cards
  ☐ 34. Player starts as ragged Shugyosha with a branch
  ☐ 35. Correct clan/character names
  ☐ 36. War Room gated L10, AI-clan-driven, kill cap 350

═══════════════════════════════════════════════════════════════════
EXECUTION RULES
═══════════════════════════════════════════════════════════════════

1. Do not proceed to the next stage until the current stage's verification
   gate passes completely. Every checkbox must be ☑.
2. Write tests BEFORE or ALONGSIDE implementation, never after.
3. Chaos-test every guard: plant the failure, verify the test goes red,
   then fix it and verify green. Mandatory for: DrawnStroke overflow,
   Sim NaN/Infinity input, config-purity violations, timescale leak.
4. All gameplay numbers in src/config/. If you find a literal in src/core/,
   it's a bug. The config-purity test is your safety net.
5. The Phaser layer NEVER owns gameplay state. It renders what Sim computes.
6. Evidence not assertion: a feature is "done" only when its verification
   gate passes. Visual feel is "unverified" until a human plays it.
7. If you hit an obstacle, diagnose the root cause and fix it. Don't paper
   over errors with workarounds.
8. RECREATE NEVER RIP. Nothing from the original game is extracted, shipped,
   or distributed. Reference videos are local-only, gitignored.

Begin with Stage 0.

════════════════════════════════════════════════════════════════════
SESSION DISCIPLINE (from agent-work-ethic playbooks)
════════════════════════════════════════════════════════════════════

RESUME HERE: At every commit, update RESUME_HERE.md at the repo root:
  - Current focus (top): the one thing to work on next
  - State: what's done, what's in flight, what's blocked; last verified-green checkpoint
  - Next concrete step: the specific next action (not a vague direction)
  - Open decisions awaiting the human: each with a proposed default
  - What-not-to-break reminder: pointer to non-negotiables
  - Spark/backlog capture: ideas noticed but not acted on, with one-line "why later"
  Refresh the handoff in the SAME commit as the change it describes.

STOP-RULE: If a stage's verification gate fails 3 times with the same root cause,
stop and write a one-line diagnosis before continuing. If a milestone isn't
paying off after 2 full sessions of work, flag it — don't sunk-cost through it.

CRASH RESILIENCE: Open a session log at docs/sessions/-SESSION-LOG.md
BEFORE heavy work starts. Update it per milestone, never "at the end."
Commit documents the moment they're stable. Never re-do what a cache will replay.

NESTED CONTEXT: Put a CLAUDE.md or AGENTS.md in src/core/ and src/config/ with
local rules (purpose, invariants, how to test, landmines). Cite symbols, not
line numbers. The root file stays lean; folders add local specifics.
