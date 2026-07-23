# SESSION 11 KICKOFF — CRUX RULED: line = blade-path-with-reach · movement gesture CONTESTED (hold-run leading; study item (b) decides)

> **Supersedes SESSION10's combat MODEL** (its step 2b "the drawn line is a
> move-to-target command that runs you to a point then slashes the area").
> It does NOT supersede SESSION10's METHOD — that carries forward intact:
> **measure-first, no code until the numbers exist, red-first TDD, binary
> gate, honest MEASURED-vs-INFERRED tags.** Entry route: `RESUME_HERE.md` →
> this file. Read **`docs/sessions/MECHANICS_GAP_ANALYSIS.md`** (the corrected
> model + crux evidence) and **`docs/research/fidelity/MOTION_MEASUREMENTS.md`**
> (applied numbers) BEFORE any work.
>
> **Standing rulings held (unchanged):** RECREATE-NEVER-RIP original
> art/dialogue (our cast keeps our names; roles/beats recreated exactly) ·
> **Duels-not-SHS** (this is *Straw Hat Samurai: Duels* — stances, skill-gated
> slashes, Focus; NOT the linear SHS 1/2) · **single-player-first** ·
> **`core/` zero-literals** (all numbers config-driven, CONTRACT/INFERRED
> labeled, zero `Math.random` in `core/`) · **near-OG palette** (owner-vetoed
> toward OG) · assertion follows MEASUREMENT · red-first · loop single-writer
> PAUSE dance.

> **UPDATE 2026-07-23 — reconciled with `docs/research/REBUILD_READINESS.md` §3
> (the 2026-07-20 24-agent research pass; newest evidence wins three points):**
> ① **Movement:** in-game **Tip #27 is explicit — HOLD mouse to run toward the
> cursor**, and that pass found **no** tap/click=move-to-target gesture. The
> "click = move-to-target" half of the hybrid ruling below is therefore
> **CONTESTED (hold-run is the leading model)**; the blade-path half stands
> (HIGH, frame-verified). Study item (b) still settles it by measurement —
> build step 1 must NOT pre-commit to click-destination.
> ② **Crit:** the "iaido-duel MEASURED 3.0×" data point is from a **different
> game** — VOID as SHS:Duels evidence. The game's own wiki (2016 + 2025) states
> **Critical = 1.3× Physical**; the 3× folklore best reads as 1.3× compounded
> with per-stance crit-damage stats (Heavy ×1.82) + item crit lines. Default
> stays `CRIT_MULT=1.3`; the (f) popup read can still seal it.
> ③ **Stance tables:** the wiki reach/dmg values are **mastery-9 CEILINGS**,
> not base (Heavy ceiling reach **100**, config's 120 is wrong; a level-1
> Shugyosha is Light ×0.5 / Balanced ×1.0 / Heavy ×1.4). Measure (c) in that
> frame and decide-and-flag which mastery the build targets.
> ④ **Stance switch:** in-combat stance is **HARD-LOCKED** in v0.717
> ("CANNOT CHANGE STANCE" — frame-confirmed below). Scope step 5 / gate
> item 5 to OUT-of-combat switching; the recreation's Focus-gated
> in-combat switch models removed 2014 behavior — label it in DIVERGENCES,
> never present it as original.

## The crux ruling (adversarial verification, 3 verifiers)

Three verifiers tried to break "blade-path-with-reach" and defend the owner's
"move-to-target." Result: **HYBRID — both are partly right.**

- **The drawn LINE is a blade path, not a move command.** Every source ties
  damage to the line itself (it cuts projectiles out of the air; one line
  strikes several strung-out enemies). Two raw duel frames
  (`reference/frames/combat_analysis/Nr4fQstqHDM_t428.5.png`,
  `reference/frames/duel_dense/Nr4fQstqHDM_432.3.png`) show a blade-arc projecting
  across a horizontal gap and connecting at its reaching tip while the body
  stays put. → **The owner's "line = inert move-to-target" is CORRECTED.**
- **A move-to-target command DOES exist — it is the CLICK, not the line.** One
  mouse button, two disambiguated gestures: **drag = slash** (blade path),
  **tap/click = walk toward that point.** → **The owner's observation that a
  move command exists is CONFIRMED; he mis-attributed it to the line.**
- **Confidence: blade-path half now HIGH; movement-gesture half + exact numbers
  stay MEDIUM.** Direct frame inspection (2026-07-18, own eyes:
  `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` → `_428.9.png`) CONFIRMS
  the drawn line is a blade path: one long horizontal blue arc reaches ACROSS a
  gap and bloodies MULTIPLE strung-out enemies at once, then retracts as the
  body flash-steps a MODEST distance along the cut (NOT a teleport to target) —
  the far enemy stays at full HP, proving a finite reach. NOT visible in combat
  frames (still to measure): the movement gesture (click-to-move vs
  hold-toward-cursor), exact reach in px, and crit multiplier. **So the study
  pass still leads with the falsification test + the (b) movement read —
  measurement settles the remaining numbers.**
  Incidental MEASURED from the same frames: player HP shows **20/20** (early HP
  is SMALL → fast TTK, supporting the damage re-tune); "CANNOT CHANGE STANCE"
  confirms the in-combat stance lock; a "150% DAMAGE" indicator is shown.

## Owner reconciliation (trust the eyes, re-wire the story)

His feel-run observations are the project's highest-precedence rule and all
**stand**: mouse-only movement, damage too low, crit too slow, stances inert,
AUTO SLASH dead. He also correctly saw *two* real things — that a move command
exists, and that you can't hit distant enemies. His causal model fused them
into one wrong mechanism. The truth: the **click** is the move command he saw;
distant enemies survive because of a **stance-capped slash REACH**, not a
teleport. The line is the blade path and it **does** damage along itself.

## STUDY PASS FIRST — no code until the numbers exist

From the longplays in `reference/videos/*.mp4` (A = `zFtCaTO0_1M` world build,
B = `Nr4fQstqHDM` duels) ledger every number into
`docs/research/fidelity/COMBAT_MEASUREMENTS.md` (create it — it does not exist
yet) or extend the existing `MOTION_MEASUREMENTS.md`. Label MEASURED vs INFERRED
per row.

**(a) THE CRUX — falsification test, do this FIRST and do NOT pre-assume any
model.** Find a clean frame sequence where a slash is drawn OVER an enemy that
is clearly far away. Two mutually exclusive outcomes:
  - **Blade-path-with-reach:** the cut whiffs / hits nothing until the player
    has mouse-closed into range; the blade FX terminates at a reach limit.
  - **Move-to-target:** the body runs to the drawn line and only then damages.
  Record which frame the damage popup/blood-spatter appears on, relative to
  the body's position. **This decides the slash model.** Capture 2–3 instances.

**(b) Movement gesture:** is it **tap/click-destination** (character walks to a
point and stops) or **hold-mouse-toward-cursor** (runs while held)? Watch for a
click marker FX, arrival stop, re-click cadence. Ledger the travel speed
(~280 px/s is the current guess — verify). Leading model per Tip #27 + UPDATE ①:
**hold-to-run** — but measure both candidates against footage, assume neither.

**(c) Slash reach per stance** in px: draw the same slash in Light / Balanced /
Heavy and measure how far the blade FX / hit extent projects. Confirm the
ordering Light > Balanced > Heavy and get real px (current table 300/200/120 is
wiki-carried and now CONFIRMED mastery-9 ceilings per UPDATE ③ — Heavy's
ceiling is 100, config's 120 is wrong; flag which mastery the build targets).

**(d) Body travel per swing:** does the body cross the FULL drawn distance, or
only a capped flash-step? (Reuse `DASH_SLASH_PX=127` if it matches — do not
re-measure what's already pinned.)

**(e) Damage numbers:** popup value per swing on early mobs (per stance if
readable), hits-to-kill on first-area enemies, HP-bar drop fractions.

**(f) Crit:** on-screen fill time (seconds/swings) empty→full; whether the fill
is the **Focus** bar (shared with stance-switch cost) or a standalone meter.
Read crit popup magnitude to seal the multiplier. Default is **1.3×** (the
game's own wiki formula — UPDATE ②; the iaido-duel 3.0× was a different game,
VOID as evidence). Only move off 1.3 on a real OG popup read.

**(g) AUTO SLASH ON:** what actually changes — auto-fire on proximity? on
click? MEASURE, don't guess.

## Ordered build sequence — red-first, per MECHANICS_GAP corrected order

Fix the existing engine; do NOT rewrite it. Each step: failing test names FIRST,
then code, then green. Named symbols are the touch-points.

1. **Mouse movement.** Wire the measured (b) gesture into `PlayerIntent` /
   `DuelScene.ts` (movement seam at **`DuelScene.ts:414`**). Sim walks/runs at
   measured speed with an arrival radius (click-destination) or toward-cursor
   (hold), per (b). Demote A/D `moveX` to a dev-seam fallback (veto = delete).
   Chaos: NaN / off-arena targets clamp.
2. **Slash = blade-path with stance-reach cap.** Pass player position into the
   resolver and gate the hit by reach. Touch **`Sim.applyStroke` →
   `resolveSlash` → `strokeCrossesPolygon` (`slash.ts:46-80`)** — today it takes
   NO player position and reads NO reach, so it connects from anywhere. Add
   player pos + `STANCE_TABLE.reach` gate. Reuse the measured lunge
   (**`Sim.ts:405-421`, `DASH_SLASH_PX=127`**) as the in-reach flash-step,
   scaled to reach. Keep the line-shape→attack-type mapping. Red test: a slash
   drawn over a beyond-reach enemy deals **NO** damage until closed.
3. **Wire stance reach + speed.** In **`STANCE_TABLE` (`stances.ts`)** make
   `reach` the slash-distance CAP (currently only scales the animation arc) and
   `speed` a real effect (swing cadence / draw speed / slash-line length).
   Feed measured (c) values. Leave `damageTakenMult` dead — only the −20% Heavy
   defense applies.
4. **Re-tune damage / HP / TTK.** Re-seed from measured (e) in config; touch
   **`damage.ts`** (leave `damageTakenMult` `:13-15` dead, documented).
   Gate: hits-to-kill on the standard early mob **== measured count exactly**;
   trash resolves in the measured band (~3–10 s per research).
5. **Unify crit under Focus.** Fold the standalone crit meter into the **Focus**
   bar (charge + spend, shared with stance-switch). Keep **`CRIT_MULT`
   (`combat.ts`)** at 1.3× (wiki formula — UPDATE ②) unless the (f) popup read
   contradicts it; the 3.0× data point is VOID (different game).
6. **AUTO SLASH honest.** Implement the measured (g) behavior, OR wire the plate
   to a true disabled state and log the deferral. **The plate must never lie
   again.**

## Gate (binary — every row pass/fail)

| # | Item | Verify |
|---|---|---|
| 1 | Study ledger rows exist for (a)–(g), numbers + frame refs, MEASURED/INFERRED tagged | ledger diff |
| 2 | **CRUX resolved by measurement:** a slash drawn over a beyond-reach enemy deals NO damage until mouse-closed (blade-path-with-reach) — recorded from footage, not assumed | ledger row (a) + red-first test name + browser capture |
| 3 | Mouse gesture (b) drives movement per the MEASURED model (hold-run: tracks cursor while held at measured speed · click-move: arrives and STOPS ±10 px); WASD demoted/deleted | browser evidence + sim reads |
| 4 | `resolveSlash` receives player pos and gates by `STANCE_TABLE.reach`; in-reach hits, beyond-reach whiffs | red-first test names + `slash.ts` diff |
| 5 | Stance switch produces a visible, measured reach/speed delta | capture pair |
| 6 | Hits-to-kill on standard mob == measured count; crit fill == measured time; `CRIT_MULT` set from measured popups | test pins + browser |
| 7 | AUTO SLASH state is real (measured behavior or honest disable) | browser toggle evidence |
| 8 | Suite · tsc ×2 · eslint · fidelity 55/55 · zero fresh-load console errors · 24-seed harness re-banded green | pastes |
| 9 | Ledgers + DIVERGENCES supersession block for the old slash model + RESUME_HERE + **SESSION12 kickoff** in the closing commit | `git show --stat` |

## Close ritual

On session close: update the ledgers, add the DIVERGENCES supersession note for
the superseded move-to-target slash model (only once the code changes, not
before), refresh `RESUME_HERE.md`, and **write the SESSION12 kickoff in the same
commit** — paste-ready, verdict stated explicitly (✅ / ⚠️ + limiter), grounded
in the live code and the numbers this session measured.
