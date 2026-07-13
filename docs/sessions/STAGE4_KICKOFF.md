# STAGE 4 KICKOFF — Campaign (title · dialogue · town · quests · RPG screens)

**Paste-prompt for the new session (one line):**
> Read `docs/sessions/STAGE4_KICKOFF.md` and execute it. Invoke the TDD
> skill before any code. Do not stop until the Stage-4 gate table is 100% ☑
> committed, or you are blocked on a decision only I can make.

Written 2026-07-13 at Stage-3 close (Session 5). Suite 377/377 · tsc/eslint
0 · Stage 1–3 gates all 100% ☑. Standing mandates:
`docs/sessions/SESSION4_KICKOFF.md` §0 (binding every session — pushback ·
Duels-not-SHS · single-player-first · near-OG palette, drawings/dialogue
ALWAYS original · fight-first boot is a prototype, and Stage 4 is where it
retires).

## 0. FIRST ACTION — loop handshake (before ANY file edit)
`touch docs/loop/PAUSE; [ -f docs/loop/CYCLE_RUNNING ] && wait for it`.
Commit per milestone — the pre-commit hook heartbeats PAUSE, and if the
session dies the loop takes over ~2 h later. Death costs nothing committed.

## 1. THE INVARIANT THAT RULES THIS STAGE (read twice)
Stage 4 is the first stage that ships **names, story, and dialogue**. The
spec's own "1:1 version" name list is permission-gated and we do NOT have
permission. The root invariant (RECREATE, NEVER RIP) therefore binds:
- **Every clan name, character name, place name, quest line, story beat
  title, and line of dialogue is INVENTED HERE, from scratch.** Nothing is
  transcribed from the original game, its wikis, or the reference videos.
- What we DO keep 1:1 is **structure and mechanics** (unprotectable): three
  clans in invader/defender/neutral roles, a tutorial-master figure, a
  mountain-pass invasion premise re-expressed in our own words, dialogue
  frames with gold corners, 3-line haiku episode cards, quest
  accept→track→complete→reward loops, the 9-slot paperdoll, "(EQ: n)"
  comparison UX, rarity border colors.
- Write our original name/story bible FIRST (M2) and commit it — every
  later milestone pulls names from that one file, so nothing drifts back
  toward the originals. UI *labels* observed on film (e.g. "QUESTS",
  "FINISH QUEST", "REWARD", stat names) are functional text, fine to match.

## 2. Work order (errata-read; one commit per milestone)
0. **M0 — Skeletal fighters (port from iaido-duel — decide-and-flag
   2026-07-13; veto = drop M0, fighters stay pose-static until Stage 6).**
   Replace `samurai.ts`'s three static poses (idle/windup/
   guard, one lean offset) with Kheshav's OWN 15-joint skeleton system from
   `~/kheshav-code/iaido-duel` (~890 lines incl. its tests:
   `game/fighter/Skeleton.ts` 167 · `FighterAnimator.ts` 150 ·
   `drawFighter.ts` 271 · `Fighter.ts` 114 · `core/anim.ts` 65 + skeleton/
   animator test files). WHY NOW: M3's town walk-around needs a real walk
   cycle — sliding statues violate the fidelity-early mandate — and the
   duel gains windup→strike→recover arcs, hit recoil, death collapse, and
   scarf flutter (closes TELLS row 20; makes tell 6's per-stance arcs
   visible instead of config-only). Adaptation rules: joint keyframes/pose
   data land in `config/` (labeled INFERRED — they are OUR read of the
   original's motion); anim math (lerp/easing/clocks) lands in `core/`
   under zero-literals with iaido's tests ported red-first; drawing stays
   in `game/` under the ratchet (new-file RED receipt). Same-owner original
   code — invariant-clean (mining-pass precedent: the fidelity ledgers came
   from iaido-duel the same way). Proportions/palette re-read OUR study
   frames, not iaido's look. Re-run the 24-seed harness after — if hitboxes
   move to limb capsules, re-pin with a RED receipt (or keep the Stage-2
   rect hitbox and defer limb-accurate collision — decide-and-flag).
1. **M1 — Boot flow + title.** Retire the fight-first prototype boot:
   title screen (brush-stroke logo, red-on-parchment, ORIGINAL mark — we
   are not "Straw Hat Samurai"), then menu → town; `?scene=duel` becomes a
   real route (keeps the Stage-2/3 duel reachable for regression). Guest
   start seeds 100 coins / 3 gold at THIS boundary (A-00 CONTRACT;
   DIVERGENCES M4-(d) veto lands here — extend `initProgression` or seed at
   the login flow, red-first either way). Loading screen with rotating tip
   line (A-00 anatomy; tips ORIGINAL).
2. **M2 — Name/story bible (`docs/campaign/BIBLE.md`) + dialogue system.**
   Invent the three clans, ~8 named characters, town/region names, the
   invasion premise in our own words. Then the dialogue engine: ornate
   gold-cornered parchment frames, white serif caps, click-to-advance,
   choice buttons (A-00/A-06 anatomy); content pulled ONLY from the bible.
   Dialogue data is config-shaped (`src/config/campaign/` or JSON at the
   game/ boundary — decide-and-flag; core/ stays dialogue-free).
3. **M3 — Town scene + NPCs.** Walk-around (A/D + interact key), procedural
   vector town built FROM study frames (B-23 overworld anatomy: location
   banner, coins/XP HUD carried over from M4/Stage 3), NPCs with talk
   triggers → dialogue → quest offers. Overworld HUD shows HP/CHI only (AP
   is menu-only — SYNTHESIS §1.2, deliberate original design).
4. **M4 — Quest system.** Accept → journal → objective flags → FINISH/
   ABANDON → reward (XP/coins via the Stage-3 accrual seam — `accrueXp`
   levels through the real curve; town-prosperity number can be a stored
   counter, Stage-5 hooks later). B-23 QUESTS panel anatomy: tabs, expiry
   line for timed quests, reward block, TAKE-ME-THERE with travel cost
   (cost pattern B-23: 🕐5). Persistence: quest flags join the profile
   save (extend `sanitizeProgression` — red-first, validator stays
   reject-don't-repair).
5. **M5 — RPG screens.** Character sheet (HP/CHI/AP pools, ATK/DEF/SPD,
   stat-point SPENDING — decision #10 below binds here; level-up modal
   +3/+1 closes TELLS row 29; level cap 80 UI clamp per M1-review flag,
   SP-cap semantics move to total-earned once spending exists), equipment +
   inventory (9-slot paperdoll A-13, "(EQ: n)" green/red compare, rarity
   borders grey/green/blue/purple, weight stat), skills screen (Stage-3
   skill points spendable on the duel skills' ranks OR display-only —
   decide-and-flag; elemental TREES stay Stage 5). Rebirth scroll UI (1,000
   coins, L80 gate, element pick — closes TELLS row 30/31 in-game halves;
   rebirth pool-max reset question binds when stat spending lands).
6. **M6 — Structure.** Season > Prologue/Episode nesting, 3-line haiku
   cards between episodes (ORIGINAL haiku — write them fresh), Prologue =
   tutorial (the tutorial-master teaches slash/jump/stance through
   dialogue + a gated first duel).
7. **M7 — Gate close.** Stage-4 gate table 100% ☑ in RESUME_HERE (browser
   items via the loop-step protocol — see §4 landmine on input events),
   TELLS rows 29–31 (in-game halves) + 33/35 as they land (34 is Stage 5),
   CALIBRATION/DIVERGENCES rows as they move, STAGE5_KICKOFF.md written to
   the bar with the verdict reported.

## 3. Gate table (seed for RESUME_HERE — spec verification gate, errata-read)
| Gate item | How it will be proven |
|---|---|
| Title screen renders, brush-stroke aesthetic | browser screenshot, zero console errors |
| Dialogue in gold-cornered parchment frames | browser screenshot + unit tests on the dialogue engine state machine |
| Town: walk around, talk to NPCs, accept quests | browser run via loop-step protocol |
| Quest tracking accept→objective→complete→reward | unit tests on quest state machine + browser run; reward accrues through the Stage-3 seam and PERSISTS |
| Character sheet shows stats, equipment, skills | browser screenshot; stat spend red-first unit tests |
| Haiku cards between episodes (3 lines, brush style) | browser screenshot; content provably from the bible |
| Season > Episode nesting functional | unit tests on campaign progression state + browser run |
| Prologue serves as tutorial | browser playthrough of the full prologue |

## 4. Landmines carried forward
- **All campaign text ORIGINAL** (§1). The M2 bible is the single source;
  review every milestone's strings against it before commit.
- **Stat-point effects are CONTRADICTORY on film** (SYNTHESIS §1.2: CHI +5
  /pt solid; HP +10/pt single sample; ATK/DEF observed +3/pt in A-14 but
  +1/pt in A-21, SPD +3 both) — decision #10, default: CHI +5, HP +10,
  ATK/DEF/SPD +1/+1/+3 (the A-21 reading is later-game and cleaner), all
  INFERRED-labeled with the contradiction cited. Veto = A-14's flat +3.
- **SP cap must track TOTAL-EARNED once spending exists** (M1-review flag,
  `progression.ts` docblock) — clamping unspent breaks the moment M5 lands.
- **Rebirth keeps grown pool maxes** — becomes REACHABLE with stat
  spending; resolve alongside M5 (research: "resets to L1" — default: reset
  maxes to base on rebirth, INFERRED, veto = keep grown).
- **Level cap 80** — core stays uncapped (flagged M1); the UI clamps at 80
  (Rebirth Scroll gate, A-17). `levelForXp` keeps working past 80 — clamp
  at the boundary, not in core/xp.
- **Browser protocol:** Phaser 3 listens for MOUSE events — synthetic
  PointerEvents are silently ignored (cost 3 dead duels to find, session
  log 2026-07-13 12:40). Occluded tabs freeze rAF → drive `game.loop.step`
  manually via `window.__game`.
- **PvE trash resolves 3–10 s** (SYNTHESIS §1.1) — town-adjacent fights are
  NOT the 20–60 s boss band; a trash-tier AI config lands with the first
  overworld encounter, whenever that is (may be Stage 5).
- **War Room, territory map, clan AI = Stage 5.** Elemental trees = Stage
  5. Do not drift.
- **HAS_CASH_PURCHASE=false** — the shop (if M5 includes the peddler)
  sells for coins/gold only, ever.
- **Quota-killed subagents = UNVERIFIED, never refuted** (audit rule).
- **Fable-5 window closed 2026-07-12** — re-check model access at session
  start; fall back to Opus 4.8 xhigh and say so (memory rule).

## 5. Open decisions for Kheshav (defaults live until vetoed)
- **#10 stat-point effects** — default per §4 (CHI +5 / HP +10 / ATK+1 /
  DEF+1 / SPD+3). Veto = A-14 flat +3 for ATK/DEF/SPD.
- **#11 dialogue data home** — default: typed TS data under
  `src/config/campaign/` (purity-scanned, double-entry exempt — it's
  content, not tuning). Veto = JSON loaded at the game/ boundary.
- **#12 skills screen depth** — default: display + rank-up costs for the
  three duel skills only (trees are Stage 5). Veto = display-only.
- **#13 guest-currency seed site** — default: extend `initProgression`
  with an optional `start` param (core-tested). Veto = seed at the login
  flow in game/ only.

## 6. Session discipline (unchanged, binding)
TDD skill first · chaos-test every guard · decide-and-flag with veto notes ·
per-milestone commits (pre-commit green heartbeats the loop) · RESUME_HERE +
session log updated in the SAME commit · ledgers updated as rows change ·
kickoffs polished to the bar with the verdict reported.
