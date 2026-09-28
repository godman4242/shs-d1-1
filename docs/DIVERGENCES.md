# DIVERGENCES.md — every deviation from the documented original, with rationale

Adopted from `~/kheshav-code/iaido-duel` (mining pass 2026-07-12): one ledger
instead of flags scattered across RESUME_HERE, session log, and config
comments. **Rules:** CONTRACT values are never silently changed — if evidence
ever contradicts one, the contract wins and the contradiction is logged here.
Every entry carries a rationale and a one-line veto path. RESUME_HERE "Open
decisions" stays the owner-facing queue; this file is the permanent record.

## Owner-decided (defaults live until vetoed — decision # from RESUME_HERE)

- **CRIT_MULT = 1.3 (spec: 3×)** — decision #1, default keep. Note from the
  iaido-duel mining pass: that project's spec lineage treats 3× as CONTRACT
  and its build measured an exact 3.000 A/B — evidence leans 3× for true
  fidelity. Owner default stands. Veto = revert combat.ts +
  config-values.test.ts in one commit; gate rows read "×CRIT_MULT".
- **MAX_DAN_RANK = 10 (spec tell 31 says 5)** — decision #2, default 10 per
  the errata block (errata wins over spec prose). iaido-duel's contract says 5
  (kyudan) — the two specs disagree; ours is errata-pinned. LANDED Stage-3 M1
  as the `rebirth` ceiling (`progression.ts` `canRebirth`; chaos-proven — a
  rebirth past the ceiling throws). Consequence: `REBIRTH.lateGold` (the 11+
  tier in source data) is UNREACHABLE under a 10-rank cap — kept as a pinned
  record only, referenced by no code path (flagged in `economy.ts`).
  VETO COMPOSITION (Session-5 review): the tenthGold tier is keyed to the
  FINAL rank (`danRank < MAX_DAN_RANK ? earlyGold : tenthGold`), which equals
  the research ordinal "the 10th" only while MAX_DAN_RANK is 10 — a veto to 5
  must also revisit the payout tier or the 5th rebirth silently pays 100.
- **Rebirth = elemental +10, stacking** — decision #3, default elemental
  (errata). LANDED Stage-3 M1: `economy.REBIRTH.attackBonusPerRebirth` was
  renamed `elementalPointsPerRebirth` (the "+10 Attack" label was research-
  wrong); `rebirth(p, element)` adds +10 of the CHOSEN element, stacking over
  N (property-tested to N=10). DEVIATION: research notes a 10th-rebirth "+20"
  elemental nuance we deliberately do NOT model — the gate specifies flat +10,
  and modelling +20 would need an invented config field (config/CLAUDE.md:
  don't invent spec-unnamed constants). Veto = add `tenthElemental` + wire it.
- **Palette = near-OG hues** — owner veto 2026-07-12 reverted the earlier
  ±5–8% trade-dress shift. Colour schemes are unprotectable; drawings and
  dialogue remain ALWAYS original (the hard line). Never re-shift.
- **Dev-only `window.__game` seam** — decision #8, default keep (DEV-guarded,
  stripped from prod). It carried every browser verification this stage.

## Mechanics readings (INFERRED where the original is ambiguous/unobservable)

- **In-combat stance switch = Focus-gated (v0.717 PvE hard-locks stance)** —
  SYNTHESIS §6.1. Out-of-combat free switch is CONTRACT; the Focus-gated
  in-combat variant is our INFERRED playability reading. Cost = FOCUS_SWITCH_COST
  × WEAPON_WEIGHT[stance being LEFT] (veto = key on target stance).
- **HEAVY_DEF_PENALTY (defense ×0.8) applied defense-side ONLY** — the
  landmine: never also apply damageTakenMult 1.25 (double-count chaos-proven,
  exact-8 pin).
- **Spawn invuln PLAYER-ONLY** (veto = symmetric) — 5 s / first slash,
  blinking indicator CONTRACT.
- **AI reactMs = attention cooldown, one decision roll per window** — flagged
  reading (veto = drop reactions). The per-tick alternative provably stalled
  approach (M6 browser bug → red cadence test).
- **Shunpo on SHIFT-hold** — Duels footage never shows Shunpo; mechanics are
  SHS2-register design-from-lore. SPACE is contractually the stance swap.
- **Kunai = flat 8 damage, defense-ignoring** — PROJECTILE_DMG=8 is
  spec-exact; the flat application is INFERRED.
- **COMBO_CHAIN_GAP_S = 3 s** INFERRED; combo resets to 1 (not 0) per kill —
  CONTRACT.
- **AI_PENDING_STANCE_MS = 600** INFERRED (stance flash telegraph queue).
- **AI_APPROACH_RANGE is Stage-4 world-aggro only** — deleted from duel AI
  (M9: the hard idle produced a dead 620–720 band; a duel is always engaged).
- **Progression readings (Stage-3 M1, `progression.ts`)** — three INFERRED
  calls beyond the confirmed +1SP/+3stat/refill: (a) the 80-SP cap is
  FIRST-RUN-only — it lifts once `danRank > 0`, matching "80 SP first run"
  (veto = cap always); (b) `rebirth` resets skillPoints/statPoints to 0 for a
  fresh L1 (research says only "resets to L1"; veto = keep them); (c) `level`
  is not hard-capped in core — a level ceiling is Stage-4 UI, the gate's
  binding rule is the SP cap (veto = clamp level to the cap).
- **M1 review readings (Session 5 hostile review, quota-degraded → inline
  triage)** — five recorded readings, two guards landed red-first
  (`accrueCoins` integer+overflow guard; `initProgression` rejects zero pool
  maxes — veto on either = relax the guard + its chaos test):
  (a) the SP cap clamps the UNSPENT pool — once SP spending exists (Stage 4)
  the cap must track total-earned or it stops binding; (b) L1→L80 = 79
  level-ups = 79 SP, so research's "80 SP first run" is loose cap×rate math
  and FIRST_RUN_SP_CAP=80 is a safety net, not a reachable value (veto = seed
  L1 with 1 SP); (c) `rebirth` keeps grown pool maxes — unreachable today
  (no stat spending in Stage 3), revisit at Stage 4; (d) the Rebirth Scroll's
  1,000-coin price + Level-80 gate (A-17) belong to the Stage-4 shop/UI
  boundary, NOT the core transition; (e) corrupt-save guards (NaN fields,
  missing elemental keys, negative danRank) land in the M4 seam validator.
  Coverage hardening landed with them: rich-character preservation pins +
  a drained-pool input-non-mutation snapshot pin, both chaos-plant-proven.
  REFUTED with evidence: "pool state core-unreachable steers game/ toward
  mutation" (in-duel pools live in Sim's FighterState; Progression pools are
  Stage-4 overworld profile state) and "fullRefill=false is dead code to
  delete" (it renders the CONTRACT config field honestly).

- **M4 profile-seam policies (Stage-3 M4, `core/profile.ts` +
  `game/profileStore.ts`)** — (a) the save validator REJECTS, never repairs:
  any failed check → null → fresh profile (veto = clamp/repair fields);
  includes cross-field invariants — level must equal `levelForXp(xp)` (veto
  = re-derive level) and a first-run save can't exceed the SP cap; (b)
  `rebirth` resets xp to 0 — level is DERIVED from xp, so a kept total would
  contradict the fresh-L1 reset (INFERRED; veto = keep xp); (c) accrued
  totals are bounded to SAFE integers (`Number.isSafeInteger`) — past 2^53
  integer math silently loses exactness and an unbounded xp total unbounds
  the O(√xp) level walk (found live: a MAX_VALUE accrual hung the suite);
  (d) A-00 guest-start currencies (100 coins / 3 gold) are NOT seeded — they
  belong to the Stage-4 login/guest flow, not the duel accrual seam (veto =
  seed them in `freshProfile` now).

## Structural deviations (deliberate, no behavior claim on the original)

- **HAS_CASH_PURCHASE = false** — deliberate deviation; the original sold
  gold. We ship no purchases, ever.
- **Fight-first boot** — today's boot-straight-to-duel is a PROTOTYPE shape;
  the original's login/menu → story → world → fights flow lands Stage 4/5
  (standing mandate #5). `?scene=duel` is a no-op by design until Stage 6.
- **Chi costs deferred to Stage 3** — skills are cooldown-gated only in
  Stage 2 (no Chi meter yet); the original gates on Chi. Flagged in RESUME.
- **Single-player first** — Duels was multiplayer-with-PvE; we build the full
  single-player game before ANY multiplayer (standing mandate #3).
- **DUEL_TARGET_SECONDS {20,60} treated as boss/PvP band** — PvE trash in the
  original resolves 3–10 s (SYNTHESIS §1.1); our 1-v-1 duel targets the band,
  world trash (Stage 4) will not.

## Cross-project fact conflicts (recorded from the iaido-duel mining pass)

- **Kill reward coins: ours 8, theirs 5.** Our MASTER_SPEC pins
  `coinsPerFoeLevel: 8` with the note "verified from actual economy.ts";
  iaido-duel's build showed "+5". Ours is the verified figure — keep 8.
- **Phaser 3.90 `particleAngle` setter is a no-op** (their M1 adversarial
  find: assigning `{min,max}` mutates `current` only; re-aim requires
  `ops.angle.loadConfig`). Not applicable today (we draw FX with Graphics,
  no particle emitters) — recorded as a landmine if emitters are ever adopted.

## Fidelity gate v1 decisions (2026-07-16 — measured HUD pass, B-23/A-28)

- **Stance-colored portrait ring dropped → constant red (#950d00).** The
  original's ring reads red in both videos and both stances; the color-coded
  ring was our invention. Stance is shown via the label text (as in the OG).
  Veto = restore the STANCE_RING map at DuelScene's portrait draw.
- **Coins/XP chrome removed from the duel HUD.** Frame-confirmed: the OG
  hides ALL overworld chrome during fights (wild mobs A-28 AND VS-duels
  B-23). Accrual/persistence (Stage-3 M4 seam) is untouched — DuelResult
  still pays and saves; rewards read on the result card like the OG. Veto =
  re-add the two texts + token/bar draws in DuelScene.
- **Standing letterbox strips removed from live combat.** The OG letterboxes
  only during encounter-intro transitions (B-23 t=3771 banded vs t=3774
  full-bleed) — amends the tell-21 reading that letterbox belongs to the
  arena. Veto = re-add the two strips in drawArena.
- **Shunpo/Critical slivers relocated right of the focus strip.** The OG has
  no such meters (they're spec-mandated INFERRED); their old slots collide
  with the measured stance-label position. Veto = drop the slivers entirely
  or restack below the label at reduced size.
- **Player overhead nameplate "GUEST" added (gold).** OG shows the player
  name over the fighter (guest mode pre-login, A-28); ours is pre-login until
  Stage 4's title flow. Veto = delete the playerName text.
- **Enemy overhead green ≠ player HP green.** Measured: overhead bar fill is
  a brighter leaf green (#179b32) vs the player bar's deep green (#02990b) —
  two palette entries on purpose, not a duplicate to consolidate.

## Fidelity v2 slice 2b decisions (2026-07-16 — intro beats, defeat card, edge scans)

- **Duel intro corrected to the measured TWO-beat sequence (VS → FIGHT!).**
  Spec item 12 described "VS card → name banner → READY → FIGHT!", but the
  B longplay (t=3771.2-3773.85, 60fps dense) shows no separate name banner
  and no READY beat — the names live INSIDE the VS band, and FIGHT! follows
  directly. The VS "card" is also not a full-screen card: it is a full-width
  black band (rows 448-584 @1080) over the LIVE arena + HUD, with portraits/
  names in-band and a red brush VS glyph overflowing it. DuelIntro was
  rebuilt to this anatomy (band + glyphs procedural where fonts put ink in
  the wrong measured places). Timing (VS 2000ms · glyph 450ms · band tail
  150ms) is INFERRED from the single clean capture. Veto = restore the
  four-step showBanner sequence (git history at this commit).
- **Result cards refit to the measured shared card system.** Both cards are
  an authored-#990000 field INSET between black side pillars (B win card:
  field x 53-1865 @1080; NO top border) with a pure-black tableau band from
  row 894. v1's "dark olive (25,34,9)" silhouette-band reading DID NOT
  REPRODUCE (three fresh frames read (0,1,0)) — probe re-pointed to black
  per the assertion-follows-measurement rule, render fixed, and the
  correction chaos-proven (olive plant → 4 probes RED → revert → GREEN).
- **Defeat card rebuilt from A-22 (the only defeat capture — a WORLD-mob
  defeat; the VS-duel defeat variant is unverified, flagged in the probe
  notes).** Anatomy: dark brush splash behind a red "YOU WERE DEFEATED!"
  headline (same authored #990000), two chrome buttons (LEAVE AREA / FREE
  RESPAWN, resting fill #5c1200 — the capture caught FREE RESPAWN hovered).
  The OG defeat card shows NO reward line — our "+0 XP +0 COINS" and
  "PRESS R TO RESTART" texts were removed from the defeat branch (the
  economy is untouched: defeat still pays nothing and writes no save;
  Stage-3 gate evidence stands). Veto = re-add the two texts.
- **LEAVE AREA is wired to restart-the-duel until Stage 4.** Its real
  semantics (exit to the world) need the town/world scenes; FREE RESPAWN's
  restart matches the OG's checkpoint respawn (A-22: back at the pre-fight
  beat ~3s later). Veto = disable the LEAVE AREA zone instead.
- **Bar fraction labels added ("150/150"-style).** Confirmed in BOTH builds
  (B-23 VS-duel: "14/30" / "47/47" centered on the bars; 2016 A8 lossless
  corroborates). White bold outlined numerals, render-only reads of the live
  sim pools. Existing bar probes sample points the glyphs never cover
  (verified: full 55-probe gate green with labels rendering).

## Session 9 dash-through slash decisions (2026-07-17 — measured bounds)

The OG's signature move: the attacker translates in EXACTLY ONE video frame
(strike-C: +240/+240/−235 px @1080), landing pose holds, red streak renders
after arrival. `DASH_SLASH_PX = 127` (mean 238.3 ÷ 1.875 = 127.1) landed in
`config/combat-sim.ts`; the rule lives in `Sim.applyStroke`. Bounds we chose
(each owner-vetoable):

- **Dash on EVERY fighting-phase slash stroke** — hit, miss, blocked, or
  dodged. The measured anatomy makes the lunge part of the swing itself
  (clash freeze happens AT arrival when blocked), not a reward for landing.
  Veto = gate the dash on `result.hit`.
- **Direction = sign of the stroke's net x** (the drawn line IS the attack
  line — the "dash along the drawn stroke" reading). A zero-net
  (there-and-back) stroke has no attack line → no dash. Veto = default
  zero-net strokes toward the enemy.
- **Fixed distance, pass-through, no stop-at-target.** All three measured
  dashes moved a constant ~127 stage px regardless of target position —
  fixed displacement, passing through the victim. Arena-clamped like every
  other movement verb (chaos-proven: clamp disarmed → both wall tests RED
  at 1121/−27 → restored → GREEN). Veto = stop at the target's far side.
- **No dash while airborne** — the jump arc owns the player's position
  (Stage-1 bug family: two owners of pos.y float the fighter). Veto =
  cancel the jump on slash instead.
- **PLAYER-ONLY for now.** Enemy strikes stay in place: AISeamController
  owns enemy range/timing, and an enemy dash changes duel balance (harness
  band re-tune) — deferred to its own measured slice. Veto = symmetric
  dash now.
- **Windup stays 0 ms** (PLAYER_WINDUP_MS — the signature draw-to-strike
  feel): dash + damage land on the same applyStroke call, and the streak
  spawns at arrival (the OG holds a 4f windup first; ours trades that for
  stroke immediacy — flagged as a knowing feel divergence, veto = add the
  4f windup hold before the snap).

Review-hardened bounds (same session — a 13-agent adversarial workflow
confirmed 6 findings; all fixed red-first, mutants planted where the gap
was test-coverage):

- **One dash per measured swing cycle.** Unlimited dashing made
  scribble-spam a teleport verb (refuter reproduced: 8 micro-slashes
  crossed the arena at sim frame 0, ~2× walk speed, Shunpo-amplified).
  Gate: `dashReadyFrame` — SLASH_FRAMES total (12/16/20f) for the stance
  at slash time, the OG's own measured strike-to-strike interval; counted
  in SIM frames so slow-mo can't amplify it. Damage stays instant — only
  movement is gated (the Stage-2 stroke-feel contract holds). Veto =
  gate damage too / different interval.
- **`DASH_MIN_STROKE_PX = 40` (INFERRED).** A ~5px mouse slip is a valid
  2-point 'slash' and teleported the player 127px. Real swings measure
  >100px of path; slips are single-digit. Veto = different threshold or
  gate at gesture level.
- **`DrawnStroke.direction` now reads the TRUE drawn endpoints** (sanitized
  input first/last), not the resampled points: resample() truncates
  runaway strokes (>2040 path px) without appending the real endpoint, so
  a long there-and-back stroke — drawn net exactly zero — carried a
  phantom direction that the dash consumed. Truncation itself is
  spec-pinned and untouched; only the derived direction changed (its other
  consumer is cosmetic blood spray). Veto = append the true endpoint in
  resample() instead (spec edit).

## Session 11 adjudication (2026-07-24 — foreign-change triage)
- **Slash reach gate is PER-SEGMENT, boundary-spanning segments count whole
  (INFERRED slack ≤ one resample segment).** The blade path terminates at
  `STANCE_TABLE[stance].reach` px from the attacker (frame-verified:
  duel_dense 428.0→431.5, one long arc bloodies in-reach enemies while the
  far enemy keeps full HP). A foreign session's any-point-within-reach gate
  let a stroke starting at the player hit enemies at ANY distance — CRUX
  test planted RED against it, per-segment fix GREEN. Veto = clip the
  boundary segment to the exact reach circle (spec-level precision).
- **STANCE_TABLE stays the wiki's mastery-9 CEILINGS (Heavy reach 120→100
  documented fix); the build TARGETS mastery-9.** The foreign "mastery-1
  halved" reaches (150/100/50) were invented and self-inconsistent (dmgMult
  left at ceilings) — reverted. Veto = model the full mastery curve.
- **HP stays 100/150 (INFERRED PvP-dummy pair) until study step (e) retunes
  BOTH sides from measured popups.** Player 20/20 IS frame-measured and
  waits in the ledger; a piecemeal half-retune was reverted. The 24-seed
  harness gate ([20,60]s · 24/24 · ≥22 distinct) was restored verbatim after
  a foreign re-band to [3,15]s — gates are never softened to fit a change.

## Session 11 study pass (2026-07-25 — measured, no code change yet)

Provenance for every row: `docs/research/fidelity/COMBAT_MEASUREMENTS.md`
(evidence frames under `reference/frames/session11/`, gitignored).

- **Counter triangle is now DEVELOPER-CONFIRMED, not wiki-inferred.** The dojo
  tutorial states verbatim "BALANCED IS EFFECTIVE AGAINST LIGHT. HEAVY IS
  EFFECTIVE AGAINST BALANCED. LIGHT IS EFFECTIVE AGAINST HEAVY." (video A
  t≈396.0) — exactly `STANCE_BEATS` as built. Upgraded from CONTRACT-by-wiki to
  DEV-TEXT. No code change; provenance comment added to `config/stances.ts`.
  This row exists so the direction is never relitigated again.

- **KNOWN DIVERGENCE (queued, deliberately NOT fixed this session): the portrait
  ring must be STANCE-COLOURED; we hardcode red.** Developer text (A t≈393.0):
  "YOUR STANCE IS INDICATED BY THE COLOR OF THE CIRCLE AROUND YOUR PORTRAIT:
  LIGHT STANCE – BLUE, BALANCED STANCE – BROWN, HEAVY STANCE – RED." Frame-proven
  in two stances from one video: balanced ring ≈ `#8c642e` (A t=114.0, t=121.98),
  heavy ring ≈ `#8a110b` (A t=583.65, label "HEAVY STANCE"). `DuelScene.ts`
  currently fills `COL.ringRed` unconditionally, and its comment asserts the ring
  "reads constant RED in the original (both videos, both stances) — the
  stance-colored ring was our invention". **That assertion is REFUTED**: the
  earlier pass sampled only heavy-stance frames (B t=3772–3776 duel + A-28), so
  red was the only hue it could have seen.
  WHY NOT FIXED NOW: our duel spawns `stance: 'balanced'`, while fidelity-gate
  points `portrait-ring-left` / `portrait-ring-right` assert the OG's *heavy*
  red — they pass today only because we hardcode red. A correct fix needs (i) the
  LIGHT (blue) hue, still unmeasured, (ii) a re-measure of ring centre/radius in
  the DUEL HUD specifically (the overworld portrait sits elsewhere), and (iii)
  re-pointing those two gate rows to the balanced hue with a provenance note.
  Doing it half-measured would risk a green 55/55 gate for no gain. Veto = accept
  the constant-red ring as a permanent simplification and delete this entry.

- **Focus meter LOCATED; our HUD layout is correct; its FILL RATE is ~2.1× too
  slow.** The OG duel HUD stacks three elements on left edge x=246 @1080: green
  HP (`14/30`), blue Chi (`47/47`, track ends x=513 ⇒ 268 px), and a white fill
  on a brown track = **Focus**. That third strip doubles as the stance-message
  slot ("CANNOT CHANGE STANCE" replaces the bar), which is why the level-1 HUD
  reads as "only two bars". Focus fills **passively and linearly** at
  **≈45.5 px/s** (two ramps: 45.0 and 46.1 px/s; flat ≈4.55 px per 0.1 s, no
  per-hit jumps) ⇒ **≈5.9 s empty→full** vs our Critical meter's **12.5 s**.
  Rate is MEASURED; the 5.9 s total is INFERRED (the ramps only span 0–49 % of
  the track; no full-fill or consumption event was captured). This confirms build
  step 5 (fold `Critical` into `Focus`) and supplies its target rate.

- **"Tip #27 = hold-mouse-to-run" is NOT a measured fact.** `REBUILD_READINESS.md`
  §3 asserts it with no verbatim quote and no primary source, and a full-text
  search of the 128-thread forum corpus finds **no** thread describing the
  movement control at all. The mouse pointer is not rendered in either recording,
  so cursor tracking is impossible. Hold-run remains the build's working default
  (already implemented) but is labelled UNVERIFIED until footage settles it.

### Session 11 study pass — agent results (2026-07-25, workflow wf_725ba028-915)

Six viewer agents, 101 measured rows. Full detail:
`docs/research/fidelity/COMBAT_MEASUREMENTS.md`; raw returns in
`docs/research/fidelity/session11-raw/`. **No gameplay code changed this
session** — see the "one coherent retune" ruling at the end of this block.

- **SAMPLING FLOOR (binds every past and future video measurement).** Both
  longplays carry only **~15 fps of unique content** in a 60 fps container
  (identical-frame runs are exactly 4 long; verified by three agents on both
  videos). Nothing finer than **66.7 ms** is resolvable from this footage. Any
  prior "1-frame" claim sourced from video is unresolvable, and 60 fps extraction
  is 4× wasted work. Veto = none; this is a property of the source.

- **CRUX RESOLVED — blade-path CONFIRMED, move-to-target REFUTED, and the two are
  reconciled.** Damage follows the DRAWN LINE, not the body: a body that ran
  straight through an enemy dealt zero damage, and every damaged enemy's centre
  lay inside the line span while the survivor's lay ≤22 stage px outside. AND the
  line is *also* the dash path — it vanishes on the exact tick the player lands at
  its far endpoint (1–4 px accuracy, 2 instances). The owner saw the run and
  inferred the line was inert; it is both the cut and the destination.

- **REACH IS NOT A RADIUS — but our implementation is already right.** Enemies on
  the wrong side survive at 106 stage px while enemies at 232 stage px on the cut
  line die. Hit-testing must be against the drawn polyline. Our `resolveSlash`
  already requires *stroke crosses hitbox* AND *within reach*, and the crossing
  test supplies the direction-sensitivity a radius lacks. The Session-11
  adjudication's per-segment gate STANDS; only the reach values are in question.

- **Reach values: Light 300 ✅ and Heavy 100 ✅ CONFIRMED by measurement
  (max 303; plateau 97–103). Balanced 200 ❌ NOT confirmed — measured 131.**
  Unresolvable: the only Balanced combat in either video is the level-1 tutorial
  fight, while Light/Heavy were measured at level 8, and the player is in HEAVY for
  essentially the entire rest of both runs. "Wiki wrong" vs "level-1 mastery"
  cannot be separated. Decision: **keep 200**, retag INFERRED/unverified. Veto =
  drop Balanced to 131 and accept a level-1-calibrated table.

- **THE OG HAS NO CRITICAL METER.** Exactly three meters exist: HP, Chi, Focus.
  Developer text names Focus and states its job — the Balanced passive CRITICAL
  EVADE reads "ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN YOUR
  FOCUS BAR IS FULL" (B t=740.0). **A full Focus bar buys i-frames while slashing,
  not crit damage** — the forum's "Focus gates crits" was players conflating the
  skill name "Critical Evade" with critical hits. Our `critical.ts` models a meter
  the original does not have. Measured economy: linear charge, **6.00 s empty→full**
  (three regressions agreeing to 0.5 %; independently corroborated at 5.9 s by a
  separate method), **−20 % per landed slash**, remainder zeroed when the slash run
  ends, unaffected by taking damage.

- **CRIT MULTIPLIER: NOT MEASURABLE from this footage.** Across ~845 s the Focus
  bar never reached full, and there is no CRITICAL popup, no gold/oversized popup
  and no crit-vs-normal pair anywhere. The 36/27 = 1.333 pair is a damage ROLL
  (30 sits between them, identical spawn geometry), not a crit tier. `CRIT_MULT`
  stays **1.3 INFERRED** — neither 1.3 nor the folkloric 3× may be called measured.

- **ORDINARY MOBS DIE IN ONE HIT.** >15 bar-disappearance events across 3
  encounters: no non-named enemy's bar was ever seen at anything but 100 % on its
  last frame. Partial bars belong only to NAMED characters. Our build needs 19
  slashes to kill a 150-HP enemy — the largest single gap to the original.

- **STANCE SWITCH IS FREE and is a PORTRAIT CLICK.** Proven by the "CHANGE STANCE"
  tooltip in the frame pair where LIGHT→BALANCED one tick later; cycle order
  LIGHT → BALANCED → HEAVY; HP and Chi pixel-identical either side of both
  observed switches. ⇒ `FOCUS_SWITCH_COST = 34 × WEAPON_WEIGHT` has **no measured
  basis**; the OG charges nothing out of combat and forbids switching in combat.

- **MOVEMENT: the verdict FLIPPED to click-destination (M2) leading**, reversing
  `REBUILD_READINESS` §3's hold-run claim — which was itself never sourced. Not a
  strict falsification: a hold-to-move variant that LATCHES target+gait on
  mouse-down is behaviourally identical in this footage. **The build consequence
  holds under both models: target and gait are latched at command time, not
  re-read live** — our Sim re-reads `moveTargetX` every tick, which is wrong either
  way. Measured: **WALK 126 stage px/s, RUN 341 stage px/s** (4 legs each, camera
  verified static); our single 280 matches neither. Gait is picked once per leg by
  leg length (walk ≤88, run ≥132 stage px; **threshold unresolved in 88–132**).
  No acceleration ramp (0→full run in one tick). **No click-marker FX exists —
  the build must not add one.** A **scripted zone-entry walk** (spawn x≈123.5 →
  auto-walk to ≈212 stage px) precedes player control in every zone.

- **Two earlier project claims CORRECTED.** (1) The A-16 "3-hit combo dropped the
  player 20/20 → 4/20" is wrong — the duel *starts* at 16/20 and the fall is
  **seven** separate 2-damage hits (the arithmetic 27/3 = 9 ≠ 5.3 was the tell);
  `SHSD_MASTER_REFERENCE` should be corrected. (2) "150 % DAMAGE" is a **timed
  consumable buff** with an mm:ss countdown, present in both Light and Heavy
  fights — **not** a Heavy-stance property.

- **Two prior measurements now CONTESTED, both left UNCHANGED pending re-measure:**
  `DASH_SLASH_PX = 127` (Session 9, video B, 1-frame snap) vs a 6–11 tick
  accelerating run measured on video A (largest single tick 71 stage px);
  and `SLASH_FRAMES` 12/16/20 (Session 8B) vs a cadence pass that found Heavy
  *faster* than Light and flagged itself unusable. Both contradictions are
  recorded in COMBAT_MEASUREMENTS "Contradictions / open" with both readings
  preserved, never averaged.

- **RULING — the retune must land as ONE coherent change, so it was NOT started.**
  One-hit kills, the deleted Critical meter, two gaits, and the reach values all
  cascade into the 24-seed harness gate ([20,60] s median · 24/24 wins · ≥22
  distinct). Landing any one alone would force a harness re-band to fit it —
  precisely the piecemeal failure this file records the Session-11 adjudication
  reverting. SESSION12 carries the ordered plan with every number ready.
  Veto = instruct that they land incrementally and accept re-banding the harness.

### Session 11 gap-fill pass (2026-07-25, workflow wf_40316854-a52)

Run after auditing the study ledger against the config surface the SESSION12
retune must actually set. 5 agents, 93 rows. **It corrected four rows from the
first pass** — corrections table at COMBAT_MEASUREMENTS §00b.

- **⚠️ CORRECTION — FOCUS *IS* THE CRIT METER.** The first pass concluded "a full
  Focus bar buys EVASION, not crit damage" from the *Critical Evade* skill text,
  and reported crit as NOT-FOUND. Both are **wrong**: when the bar fills, the HUD
  prints **"CRITICAL HIT"** inside it (A t=1747.000 and t=2175.933 — the only two
  full-bar events in 65.8 minutes of play). *Critical Evade* is a **separate
  Balanced-stance passive** that also keys off a full bar. The Kongregate forum's
  "a FULL focus bar enables a critical slash" was right all along. ⇒ SESSION12
  must **gate crit on Focus**, not delete crit. `CRIT_MULT` still stays 1.3
  INFERRED: the *mechanism* is now measured, the *magnitude* is not.
- **⚠️ CORRECTION — the "−20 % Focus per landed slash" is NOT a general rule.**
  Only 19 real drops in 111 charge cycles across 59,262 sampled frames; 92 cycles
  contain no drop at all, and one rose monotonically 2→100 px through a completed
  dash and two registered hits. Drop size is constant within a fight but differs
  between fights (−19.8 / −15.4 / −11–16 / −46.5 / −58.8 %). Do not hard-code it.
- **⚠️ CORRECTION — named-enemy HP bars do NOT shrink in total width.** Their
  track is FIXED at 130 px with the green fill shrinking inside it and a dark-red
  remainder. The first pass's "total width shrinks" reading holds only for 1-hit
  mobs, which are only ever seen at 100 %. The bar is a PERCENTAGE bar and
  px-per-HP is NOT constant (JINBEI 0.985 px/HP vs HONDA 2.95 px/HP on the same
  130 px track) — never hard-code px-per-HP.
- **⚠️ CORRECTION — the stroke vanishes on the FIRST DASH tick**, not when the
  player lands.
- **FOCUS CHARGE TRIGGER = holding the slash input** (gap F, PROVEN). The charge
  leads the visible stroke by up to 1.2 s with the player's nameplate pinned to
  ±0.3 px and nothing drawn on screen — the only thing changing is invisible
  input. It does not charge while idle (94.06 % of frames read zero) and does not
  pause while drawing. Fill 5.97 s, confirming the 6.00 s figure.
- **IN COMBAT THERE IS NO SEPARATE MOVE COMMAND** (gap G). Every travel leg is
  caused by one drawn stroke: APPROACH-RUN (349 stage px/s) to one endpoint, then
  a fixed 2–3 tick DASH along the stroke to the other, then a dead stop — landings
  accurate to 1–2 px. Zero stroke-free movement ticks exist in combat.
  Hold-to-run-toward-the-CURRENT-cursor is **falsified in combat** by the abrupt
  2.7× speed change at the stroke's near endpoint; the **latch-on-mousedown**
  variant survives. Out of combat, movement is strokeless and decelerates into
  its target.
- **NAMED-ENEMY NUMBERS for the duel retune:** JINBEI (4) = **132 HP, 3 hits**
  (42+48+42 = 132 exactly), 3.2 s, vs an L5 player (HP 20). HONDA SHIZUKA (7) =
  **~44 HP, 3 hits**, 7.4 s, vs an L10 player (HP 30 / Chi 47) — the closest
  analogue to our `DuelScene` (challenge → VS card → FIGHT! → YOU WIN).
- **DAMAGE IS A MIN/MAX ROLL** (gap C): 36/10/30/27/42/48/42 on ONE target at ONE
  level in ONE stance with ONE weapon. Modelling it faithfully requires the
  injected RNG in `physicalDamage`, touching determinism and the 24-seed
  fingerprint. Veto = keep damage deterministic and log the divergence.
- **PLAYER DAMAGE IS NOT A FUNCTION OF LEVEL** — a LEVEL 10 player dealt *less*
  raw damage (17–21) than a LEVEL 5 player (27–48). Weapon and target defence
  dominate. Never scale damage from level alone.
- **GAIT IS CHOSEN BY DESTINATION TYPE FIRST** (gap E), not distance: a 202.2
  stage px WALK toward a map exit and an 87.4 stage px RUN toward an enemy both
  falsify the pure length threshold. Exit/transition ⇒ walk at any distance;
  hostile ⇒ run at any distance; the distance threshold — narrowed to
  (105.2, 130.8] stage px — applies only to plain ground moves.
- **ENEMY AI, measured** (gap H): approach is **walk only** (128 stage px/s; the
  earlier "~22 px/tick" was the PEAK of a stuttering walk, mean 16–18 — building
  at 22 makes every mob ~25 % too fast); the deep-lean run is used *only* as the
  attack lunge (484 stage px/s). Cadence median 0.733 s. **Telegraph has TWO
  cases — 600 ms when closing distance (confirms our ≥520 ms) and 267 ms for an
  in-place follow-up, so a single global threshold is WRONG.** No telegraph FX —
  pose only. The attack is a **dash-THROUGH** (commit at 194 stage px, damage
  resolves 96 stage px PAST the player), so a radius range-check cannot reproduce
  it. **Enemies take TURNS** (1, occasionally 2, even with 8 on screen) — needs an
  attack token. **Zero blocks, parries or dodges** in ~70 s across ~30 enemies:
  our `AISeamController.react()` models behaviour the original does not have.
- **HITBOX HALF-WIDTH: still NOT-FOUND**, honestly. Upper bound 40.3 stage px. The
  blocker is a real confound: damage appeared to resolve over the whole **dash
  sweep** from the player's start position, not just the drawn line (two enemies
  *behind* a line's near end died in one slash) — which tensions with the crux
  strand ② negative. Measure it next with a single-enemy stationary duel, reading
  hits from the red damage numerals rather than bar disappearance.
- **TOOLTIP-AS-CURSOR IS CONTESTED.** One agent proved a tooltip sliding 115 px
  while its object and the camera stayed pixel-fixed (⇒ renders at the cursor);
  another found dojo/overworld tooltips in a FIXED top-left slot carrying no
  cursor information. Both recorded; likely two tooltip families. Verify before use.
- **AUDIT CORRECTIONS TO OUR OWN §0b:** AP is **30/30**, not the 50/50 first
  recorded off a downscaled survey thumbnail (independently corroborated by a
  second agent's character-sheet read).

## Source dive (2026-07-25 — the original's own constants, NO code change yet)

**The SWF protection is broken and the payload is decompiled.** Full method,
verification and every extracted number: `docs/research/fidelity/SOURCE_CONSTANTS.md`.
Nothing in `src/` changed this session — these are readings, queued for SESSION12.

- **BUILD IDENTIFIED: v0.717** — `StatsManager.clientVersion = 0.717`, rendered as
  `"v" + clientVersion` → the exact string on our captured title screen. **The
  decompiled payload is the same build our video measurements came from**, so the
  Tier-3 cross-check is strict rather than approximate. The manifest's `0.706` is
  dead code (read into a local, never used). The android payload is **0.682** — an
  *earlier* build despite a newer SWF container; its four data tables are therefore
  tagged `CONTRACT-SRC (0.682)` and must never be quoted as 0.717.

- **CONFIRMED — our value was already right (no change needed):**
  `CRIT_MULT = 1.3` (source: `stanceDamage * 1.3 + equipCritBonus`) ·
  `HEAVY_DEF_PENALTY = 0.2` applied as `defense × 0.8`, **defender-side, heavy only**
  (the Stage-2 landmine's "apply ONE, never both" ruling is vindicated —
  `damageTakenMult 1.25` stays data-only) · damage is a **roll**
  (`minDamage + rand × damageRange`) · **no level scaling** of damage · the stance
  triangle and its ×1.2/×0.9 · duelists cannot block.

- **CONFIRMED — measurement and source agree to within 0.5 %:** Focus fill. Source
  meter is 192 raw units filling at +1/frame (8.000 s), but the **bar renders
  `(current − 48)/144`**, so the *visible* fill is 144 frames = **6.000 s** against
  our measured **5.97 s**. The hidden first 48 units also explain the refuted
  "−20 %/slash" rule and why small spends showed no visible drop.

- **CONFIRMED ×2 — mobs die in one hit:** authored `<hp>1</hp>` in the recovered
  495-row `npcdata` table *and* independently forced by `setLevel`
  (`if (lvl <= 10) { damage = 1; defense = 1; maxHP = 1; }`).

- **CONTRADICTED — four project beliefs are wrong, recorded not silently fixed:**
  1. **`COUNTER_BONUS = 1.25` models a mechanic that does not exist.** There is no
     counter/parry/riposte anywhere in the payload. The forum's "~20 %" is the
     stance triangle. Veto path: keep it as a deliberate divergence and say so.
  2. **`STANCE_TABLE.reach = 300/200/100` is wrong in kind.** Duels reach is a
     stat-driven formula (`base = 120 + floor((90+5·dan)·A/(20+A))`, then per-stance
     multipliers), and it is the **arc-length budget of the drawn stroke**, not a
     radius and not a per-stance constant. Worse: `200` is the *placeholder default*
     of `maxDistance`, overwritten on every stance change — and `300`/`200` are also
     the SHS1/SHS2 `maxDistance` constants, which **disagree with each other by
     50 %**. Our table looks like lineage contamination plus a placeholder.
  3. **Combo "resets to 1 on kill" (Stage-2 CONTRACT) is wrong.** It resets to **0**,
     only when the player takes damage, and **not** on a kill. It is also purely
     cosmetic — no damage/XP/coin bonus, no decay.
  4. **Stance switching is not free in combat** — it costs **48 focus** and is gated
     on affording it. Our footage reading was out-of-combat; both are true in context.

- **ARCHITECTURAL — named-enemy HP is not authored.** It is recomputed at spawn from
  the *player's own stats* so a fight lasts K hits: `enemyHP = effPlayerDmg × K`,
  `K = max(8+Δ, 1)`. This reproduces our measured **JINBEI (4) = 132** exactly
  (K clamps to 3; 3 × 44 = 132, and 44 is the mean of the measured 42/48/42).
  **SESSION12 must not tune enemy HP as a constant.** Decide-and-flag: model
  hits-to-kill and derive HP; veto = keep authored HP and log it as a divergence.

- **RESOLVED — "UNRESOLVABLE" items.** *AUTO SLASH ON* hands the player's fighter to
  the **enemy AI routine** and locks out manual input entirely (decision every 12
  frames, nearest target by |Δx| at unlimited range, synthesises a fake stroke through
  the same pipeline). *`ENEMY_BASE.defense`* now has the real 495-row table — the
  desktop build fetches it from a dead server (confirmed **never archived**), but the
  **android build ships all four data tables embedded**.

- **RESOLVED — the hold-to-run dispute.** Hold-to-move **does exist**, but only in the
  **town/world** input mode; battle uses draw-mode or auto-slash-mode. The
  REBUILD_READINESS §3 belief was half right, applied to the wrong scene.

- **UNCONVERTED — do not act on these yet.** (a) ~~walk/run measured **126/341 stage
  px/s** vs source **96/288 world px/s**; a render scale exists and ≈1.2 fits both
  well, but the factor is **not independently confirmed** — do not convert until it
  is.~~ **RESOLVED 2026-07-26 (SESSION13 A0) — the factor is not a fit, it is
  computed by the original's own resize routine: ×1.2 exactly, with 32 px pillarbox
  bars. See the SESSION13 block below.** (b) `SLASH_FRAMES` stays CONTESTED: the anim XML orders light 29 > balanced 26 >
  heavy 21 (opposite to our 12/16/20), but `part b` carries a loop flag `l="1"` so the
  sums are lower bounds, and two naming families exist. (c) `DASH_SLASH_PX` is not a
  constant — the dash runs to the stroke endpoint uncapped, in **two legs**.

- **Method.** 6 mining agents → 6 adversarial verifiers → 1 lineage agent:
  **152 CONFIRMED · 37 CORRECTED · 0 REFUTED**. The verify pass caught a dead `×2`
  damage path, an inverted camera reading, a missed second dash leg, and the entire
  495-row enemy table the miner had written off as permanently server-side.

- **Placeholder discipline.** Two traps were caught and are recorded so they are not
  re-adopted: the static UI mockups (`slash distance: 345 (heavy)`,
  `physical dmg: 1234 - 1235`, `hp: 123 / 123`) and the `maxDistance = 200` default.


## SESSION 13 — A0: the WORLD / STAGE split (2026-07-26)

**Decision D1 (kickoff §1).** The simulation moves to the original's own logical
stage — **WORLD 800 × 480** — while the canvas stays **STAGE 1024 × 576**. Every
gameplay constant is now expressed in world units, so source values drop in with
no conversion.

- **The transform is the original's, not ours.** `src/core/viewport.ts` transcribes
  the payload's resize routine verbatim (`w=800, h=480, hTall=690`) and *computes*
  `scale`, `xOff`, `yOff` for an arbitrary canvas. For 1024×576 it yields
  **scale 1.2 · xOff 32 · yOff 0**, i.e. `stage = (32 + 1.2·worldX, 1.2·worldY)` —
  uniform ×1.2 with 32 px pillarbox bars. Pinned in `tests/viewport.test.ts`
  (8 assertions incl. both branches and the `hTall` override).
  **Chaos-proven:** planting the first draft's guessed 1.28 (WORLD_HEIGHT 480 → 450)
  turned 6 of the 8 assertions RED, naming `scale: 1.28`; restoring → 8/8 green.
- **Independent corroboration, found while landing this.** The result card's red
  field is frame-measured starting at study-frame x≈53–56 and ending x≈1861–1865 on
  a 1920-wide capture. The world region at that capture scale is exactly
  x ∈ [60, 1860] — so the card's "black pillars" ARE the pillarbox bars, and the
  gate's own `win-field-left-edge` (0.0279 → 28.6 stage px, tolPx 4) is sampling the
  world's left edge at 32. The transform was already sitting in our measurements.
- **The 55/55 fidelity gate is invariant by construction, and was re-proven.**
  Only sim-owned positions convert; arena art, HUD, blood droplets and pose-local
  skeleton coordinates are **stage-space native** and are annotated as such in
  `anim.ts`, `poses.ts`, `fx.ts` and the render half of `combat.ts`. In-browser
  after A0: `GATE pass=true | probes 41/41 | scans 14/14 | TOTAL 55/55`.
- **One real bug this found.** `src/game/fidelity.ts` read `sim.enemy.pos` and
  sampled the canvas as if it were stage px; after the split that pointed 143 px
  off and `enemy-bar-green` failed. Fixed by converting through `worldToStage`
  at that call site — i.e. **the harness was corrected, the gate was not re-fitted**
  (§6 Risk 1).
- **Conversion rule, applied mechanically.** Every exported numeric in `src/config`
  dimensioned in px or px/time is either rescaled (`(x−32)/1.2` for x-positions,
  `/1.2` for lengths and y) or explicitly annotated `stage-space native`. Rescaled:
  `AI_KUNAI_RANGE` 240/720→200/600 · `AI_STRIKE_RANGE` 132→110 · `AI_APPROACH_RANGE`
  620→516.67 · `ENEMY_SPEED` 0.17→0.1417 · `SMOKE_BOMB_DISTANCE` 180→150 ·
  `DEFLECT_RADIUS` 64→53.33 · `PROJECTILE_SPEED` 0.55→0.4583 ·
  `PROJECTILE_HIT_RADIUS` 26→21.67 · `PLAYER_MOVE_SPEED` 0.28→0.2333 ·
  `DASH_SLASH_PX` 127→105.9 · `DASH_MIN_STROKE_PX` 40→33.33 · `RESAMPLE_SPACING`
  8→6.67 · `LAUNCH_FLICK_MAX_LEN` 90→75 · `JUMP_APEX_PX` 120→100 · `DUEL_SPAWNS`
  260/700/430/26/60 → 190/557/358/22/50 (gap 440→367) · `STANCE_TABLE.reach`
  300/200/100 → 250/166.67/83.33.
- **`DASH_SLASH_PX` re-derived rather than re-divided.** The measurement is 238.3
  study px; ÷2.25 (the original's own 1080/480 study-frame scale) = **105.9 world
  px**. The old stage route (÷1.875 → 127.1, then ÷1.2) lands on the same number —
  a second check on the transform.
- **`STANCE_TABLE.reach` is converted even though it is known WRONG IN KIND** (the
  source makes reach a stat-driven arc-length budget, and `200` is the source's
  placeholder default). B3 deletes the field. It is converted anyway so the sim is
  never running stage-sized reaches inside a world-sized arena.
- **A0 DOES move the 24-seed harness, and by how much is now measured, not assumed**
  (the kickoff's §4 A0 decision point). Median **28.492 s → 28.800 s (+1.1 %)**,
  24/24 wins, 24 distinct durations — well inside the standing `[20, 60]` band, so
  **A0 lands alone and green** rather than being deferred into Phase B. The split is
  a similarity transform everywhere *except* the arena clamp: the walkable band was
  stage `[26, 998]` (world −5 … 805) and is now world `[22, 778]`, which is the only
  reason anything moved at all.
- **`tests/Sim.test.ts` fixtures were transformed, not retuned.** Its coordinates
  were authored in the old stage space; an `sx()` helper divides each by the same
  `VIEW.scale`, so every distance, margin and kunai flight time keeps *exactly* the
  relationship to reach/dash/radii it was written to test. Without it, `slashStroke`
  fell 7 px short of the enemy and 38 tests went red for a reason that had nothing
  to do with what they assert.

> **Veto:** keep one space at 1024×576 and convert each source constant on use
> (×1.2, plus the 32 px offset for positions but NOT for lengths). Recommended
> against — two different conversion rules at every call site is a bug generator.


## SESSION 13 — A0.5 / A2 / A3: the rest of Phase 0 (2026-07-26)

### A0.5 — the stat inputs the formulas need (additive, nothing consumes them)

`src/config/stats.ts` and `src/config/reach.ts` created. Two notes worth keeping:

- **The reach stat is SPD (Speed), not agility.** The kickoff's own §4 A0.5 line
  says "agility"; that is a leftover from its first draft, which §1 D2 explicitly
  corrects ("the getter reads the Speed stat index", and the source's stat notes
  say *"Speed does not touch damage — it sets blade LENGTH"*). Named `spd`.
  Decide-and-flag; veto = rename, but fix D2 in the same edit.
- **The mastery curves are a PERMUTATION, and that is why D2a works.** The same
  three shapes appear in the reach table and the damage table, swapped between
  light and heavy: light gets flat ×1.4 reach and `0.5 + 0.04m` damage; heavy gets
  `0.5 + 0.04m` reach (floored at 100) and flat ×1.4 damage; balanced runs
  `1 + 0.02m` in both. Evaluating them at **mastery 10** gives exactly our legacy
  `STANCE_TABLE.dmgMult` 0.9 / 1.2 / 1.4 — confirming that table was ceilings, as
  labelled, and pinning what B2/B3 must replace it with.
- **Stated character:** level 9 · SPD 1 · ATK 1 · dan 0 · **mastery 0**. Mastery 0
  is CONTRACT-SRC (the skill-level getter returns 0 for anything unpurchased).
  The weapon min/max split is chosen to reproduce the existing `atkPlusWeapon`
  totals (10 and 7) EXACTLY — a decomposition, not a new number — and
  `damageRange` is 0 until a weapon model exists (D6's RNG scope note).
- ⚠️ `DUEL_ENEMY.level` is still 1 and is deliberately inconsistent with the 9
  seeded here until **B4** lands both plus the XP knock-on (`level×5+45` = 90).
  Nothing reads the stats yet, so nothing is wrong in between.

### A2 — combo corrected (D8). **This reverses a Stage-2 CONTRACT.**

- ❌ **"Combo resets to 1 on a kill" was WRONG.** It resets to **0**, and **only
  when the player takes damage** — never on a kill.
- ❌ **`COMBO_CHAIN_GAP_S` modelled a decay that does not exist.** Deleted, along
  with its pin and `Combo.kill()`.
- The counter is purely cosmetic: no damage/XP/coin bonus.
- Consequence: `Combo` no longer touches the Sim clock — `hit()` takes no frame.
  A frame argument coming back would mean gap decay came back with it.
- The two Sim-level pins were **replaced, not deleted**, so the refuted behaviour
  stays actively guarded ("NO gap decay: a long idle stretch does not restart the
  chain" and "the killing blow does NOT reset the combo").
- Chaos-proven both ways: restoring `kill()` → RED; making `damaged()` reset to 1
  → 3 RED across `combo.test.ts` and `Sim.test.ts`.

> **Veto:** keep reset-to-1-on-kill as a deliberate divergence and say so here.

### A3 — AUTO SLASH implemented properly (D7). **The plate no longer lies.**

- The toggle hands the player's fighter to its **own** `AISeamController`
  instance (never the enemy's — the controllers carry telegraph/mode state, and
  sharing one would interleave two fighters' decisions) and **locks out manual
  input entirely**: hand-drawn strokes and move orders are discarded. Skills and
  HUD keep working, as specified.
- The synthesised stroke is `floor(reach / AUTO_SLASH_POINT_SPACING)` points, 20
  world px apart, **anchored at the attacker** and aimed at the target — and it
  enters **`applyStroke`**, the same entry point a hand-drawn stroke uses, tagged
  `source: 'auto'`. It dashes, damages and advances the combo identically. That
  shared path is the point: it is the strongest available check that the slash
  pipeline is correctly factored.
- Player-anchored **on purpose**. Our own 24-seed harness bot draws a
  target-CENTRED line (`enemy.x ± 140`), which §3.3 names as a thing to fix, not
  to copy.
- The generated line is emitted as a `SimEvent` (`autoStroke`) and **drawn on
  screen** through the same two render paths a manual stroke takes.
- Gating: never mid-swing (the measured `SLASH_FRAMES` cycle), never airborne,
  and at most one decision per `AI_THINK_INTERVAL_MS` = 500 ms. **Stun is not
  modelled in this Sim** — flagged, not silently dropped.
- `AI_THINK_INTERVAL_MS` is introduced here rather than in B4 because D7 needs it.
  It is COARSER than every tier's `reactMs` (420/320/220), so while auto-slash
  gates on it the controller's internal hold never binds — one cadence, not two.
  **B4 re-points the enemy AI at the same constant and deletes `reactMs`.**
- `setAutoSlash(true)` with no injected controller **throws**. D7's veto reads
  "the plate must never lie again", so the toggle fails closed rather than
  silently doing nothing.
- **A chaos plant found a hole and it was fixed.** Deleting the mid-swing gate
  left the suite GREEN: the 30-frame think interval always dominates the
  16–20-frame swing cycle, so the gate was never exercised. The test was rewritten
  to toggle auto-slash ON *mid-swing* (think timer wide open, so only the swing
  cycle can block) — it now goes RED when the gate is removed. All four A3 guards
  are chaos-proven: manual lockout, fail-closed toggle, mid-swing, airborne.
- **Browser-verified**, zero console errors: clicking the plate flips it to
  "AUTO SLASH ON"; over 900 driven frames the fighter closed 236.7 → 565.1 world
  px unaided and landed a hit (enemy 150 → 142) while taking damage
  (100 → 52.8). It does not yet WIN — enemy HP is still the PvP-dummy 150, damage
  is unbalanced and the melee gate is 2× too generous; B1–B5 are what fix that.
- Fidelity gate re-run after A2+A3: **55/55**.

> **Veto:** wire the plate to a genuinely disabled state and log the deferral.


## SESSION 13 — PHASE B: the coupled core (2026-07-26)

Landed as ONE change, because Focus, damage, reach, the dash, movement and the
enemy model all move time-to-kill; landing them piecemeal leaves the harness red
between steps and the pre-commit hook forbids committing red.

### B0 — the harness band, re-derived ONCE and then fixed

`DUEL_TARGET_SECONDS` **`[20, 60]` → `[8, 25]` s**.

`[20, 60]` was **never a measurement**: it came from the original kickoff SPEC,
around that spec's own ~24.7 s reference — which this repo's harness header had
flagged for a year as *"the reference bot's own number"*. K = 10 hits-to-kill at
the bot's 0.842 s cadence predicts a ~10 s fight, so the old band missed by ~2×.
The new band preserves the spec band's own **relative** width `[0.81×, 2.43×]`
around a model-derived centre: same discriminating power, honest centre.

Both inputs were re-checked against the code as it stands (`SLASH_EVERY_FRAMES`
45 + `uniform(0..11)` = 50.5 frames ✓; Δ = 0 ⇒ K = 10 ✓). The derivation and the
**stop-and-escalate rule** are pinned in `tests/harness.test.ts`.

> This is the one thing this session was built to get right. The band was set
> **before any Phase-B code existed** and never touched afterwards.

**Result: median 10.575 s** — inside the paper prediction's own 9.3–10.9 s
window. 24/24 good-play wins, 0/24 no-play, 0 timeouts, 24/24 distinct.

### B1 — Focus is the source's ONE meter; movement gets two gaits

- `critical.ts` → **`focus.ts`**. `CRITICAL_MAX` / `CRITICAL_FILL_PER_S` and the
  HUD's gold sliver are **deleted**: the original has three meters (HP, Chi,
  Focus) and **Focus IS the crit meter**.
- 192 integer units · +24/s · spend 24/48/72 by stance · kill bonus +6 ·
  **starts EMPTY** · bar renders `(units − 48)/144`, so the first 48 units are
  invisible. That one quirk explains THREE anomalies at once: the measured
  5.97 s fill against a raw 8 s meter, small spends showing no visible drop, and
  the forum's "−20 % per slash" looking false on film.
- **Residual accumulator**, not a closed form. `floor(ticks × 2/5)` is a function
  of TOTAL ticks and silently recomputes over any spend. Chaos-proven: planting
  the closed form turns the fill-spend-refill test RED.
- **P3 honoured:** slashing is NEVER focus-gated — only stance switching is.
  Focus is a crit-charge resource, not stamina.
- **D9:** stance switching costs a flat **48**; `FOCUS_SWITCH_COST = 34` and the
  whole `WEAPON_WEIGHT` table are deleted.
- Movement: **walk 96 / run 288 world px/s** (×1.2 → 115.2 and 345.6 stage px/s,
  against measured 112–126 and 341–349 — our single 280 matched neither), gait
  AND target **latched at command time** (the null→value edge, not every held
  frame), deadzone 25, standing range 50 (snaps, never overshoots), no
  acceleration, arrival snaps.

### B2 — one damage pipeline, in the source's exact order

`raw → ×mastery → ×crit(+flat) → ×triangle → −defence → level floor → body-part
crit (positioned NO-OP)`.

- ❌ **`COUNTER_BONUS` deleted.** It modelled a counter/parry/riposte mechanic
  **the original does not have**. The forum's "~20 %" is the STANCE MATCHUP:
  win ×1.2 / **lose ×0.9** / mirror ×1.0, applied pre-defence. Note the second
  half — the old one-sided bonus had **no penalty at all**.
- Level-tiered min-damage floor (`≤10 → 1 · ≤20 → lvl/8 · ≤30 → lvl/6 · else
  lvl/4`).
- **Not implemented, and why:** elemental resists (no elemental system exists);
  body-part crit ×1.3 (needs limb hitboxes) — it lands as a no-op in its real
  position, AFTER the floor, so only the multiplier has to arrive later. The
  source's `×2` doubling is **dead code** (its flag is never set) and is not ported.
- **No RNG threaded.** `damageRange = 0` with no weapon model, so paying for
  determinism to randomise nothing was declined (D6's own scope note).

### B2/D2a — `core/mastery.ts`: ONE mastery drives BOTH tables

`STANCE_TABLE.reach` and `.dmgMult` are **gone**. Both are stat/mastery
functions now. Reading reach at mastery 0 while leaving damage at the mastery-10
ceiling is precisely the self-inconsistency the Session-11 adjudication reverted.

**Found while implementing it:** the reach and damage curves are the SAME three
shapes, permuted between light and heavy — light has flat reach and scaling
damage, heavy the mirror, balanced scales in both. Evaluated at **mastery 10**
the damage curves give **0.9 / 1.2 / 1.4** — exactly the legacy `dmgMult`. That
is what proves the old table held CEILINGS, and that this module generalises it
rather than replacing it with a guess.

### B3 — reach is an ARC-LENGTH BUDGET; the dash follows the stroke

- `DrawnStroke.truncateTo(reach)` spends the budget along the drawn line, ending
  **exactly** at the budget (interpolated, not at the nearest sample).
  `resolveSlash` lost its `attacker.pos` / `reach` params and is now a plain
  crosses-hitbox test; **`withinReach` is deleted**. Keeping both a budget and a
  Euclidean radius double-counted reach against two different quantities, and
  the source has no radius anywhere.
- The property this buys, which a radius cannot express: **a curvy stroke covers
  less ground than a straight one** on the same budget. Pinned.
- `RESAMPLE_SPACING` 6.67 → **20** (the source's own).
- **`DASH_SLASH_PX` and `DASH_MIN_STROKE_PX` deleted.** The samurai travels to
  the stroke's **last point**, uncapped, at **50/40/30 world px/frame** by
  stance — bounded in practice because the stroke was already truncated to
  reach. The Session-9 measurement (one video frame ≈ 105.9 world px) is
  reproduced by 40 px/frame across the 15 fps sampling floor, i.e. it was never
  a distance at all — which that measurement's own caveat had warned.
- **KEPT:** at most one dash per measured swing cycle. The Session-9 review
  reproduced scribble-spam as a teleport verb; deleting the bound re-opens it.

### B4 — the enemy is DERIVED from the player, and the AI loses three fictions

- `core/enemyModel.ts`: `enemyHP = effPlayerDmg × K`, `enemyMinDmg =
  playerMaxHP / D`, `K = max(10+Δ, 3)` / `D = max(18−Δ, 3)` from the
  **NAMED-DUELLIST** class, `xpReward = level×5+45`, and the `level ≤ 8`
  override implemented **after** the HP line (chaos-proven both ways).
- **Both fighters to level 9** — the lowest level escaping that override. At our
  old level 1 the enemy was forced to 1 damage and 1 defence: the duel was
  literally unlosable. Δ = 0 ⇒ K = 10, D = 18.
- ⚠️ **`ENEMY_BASE.hp` 150 → 1.** A 150 would have won the source's own
  `max(scaledBase, …)` (150 > 50) and quietly kept HP an INPUT, defeating the
  entire derivation. The source authors trash HP as `<hp>1</hp>` for the same
  reason. INFERRED — veto = supply a measured level-scaled base.
- **XP 90, not 10.** Our `+10/+8` was verified only against OUR OWN build's
  screenshots — never an OG measurement — so the Stage-2 gate row is corrected
  rather than left silently false. **Coins stay a flat, INFERRED 8**: there is
  no source formula, and scaling a guess by the foe's level (→72) would be
  arithmetic dressed as evidence.
- **`react()` deleted**, with its three tier fields. The original's enemies do
  not block or dodge (measured: zero blocking across the study corpus). The old
  "a blocking enemy negates the slash" pin is **replaced** by its opposite: a
  planted block/dodge must change NOTHING.
- **`telegraphMs` deleted from the tier table.** The windup is TWO measured
  cases — 600 ms closing / 267 ms point-blank. The single global "≥520 ms" was
  wrong; the contract is now "the strike lands exactly the duration the
  telegraph ANNOUNCED".
- **`AI_STRIKE_RANGE` (110 world px) → `AI_MELEE_RANGE {x:50, y:50}`.** It was
  2× too generous and had **no vertical term at all**. This gate is half the
  mechanism behind emergent turn-taking — which is why **no attack token** is
  implemented: the appearance of turns emerges from independent 0.5 s timers
  plus a narrow gate, and a token would be inventing a mechanism to reproduce an
  effect that already emerges.
- `AI_THINK_INTERVAL_MS = 500` now drives the enemy's decision cadence too.

### B5 — the harness, and the one diagnosis it forced

First run: median 8.358 s (in band ✓), 24/24 ✓, 0/24 ✓ — but only **15 distinct
durations** against the gate's ≥22.

Per §3.3 the permitted diagnosis (a) is the bot's stroke geometry, and it was
exactly that: the bot drew `enemy.x ± 140`, a line **centred on the target**,
which always crosses the enemy and therefore can never miss. Every fight was
exactly K swings plus jitter, collapsing 24 seeds into a 34-frame window.
**Anchoring the stroke at the player** — one reach along the attack line, the
same shape AUTO SLASH synthesises — restores the miss-then-close dynamic the
real game has.

**The band was NOT touched.** Median moved 8.358 → **10.575 s**, landing inside
the paper prediction's own 9.3–10.9 s window, with **24/24 distinct**.

> **Veto (whole phase):** keep `[20,60]` and tune the model until it fits.
> *Recommended against* — that is fitting the game to the test, and it would
> require roughly tripling enemy HP above what the original's own K produces.

### Fidelity gate: one honest state correction

`focus-strip-left` went red after D4, reading the brown backing. Cause: the
harness sampled `'fighting'` at **t≈0**, and that state was documented as "full
HP/Chi/**Focus**" — only ever true because our meter used to start half-full.
The source's meter starts EMPTY with 48 invisible units, so at t≈0 the pill is
genuinely blank, while the probe was measured **mid-fight** ("fill length varies
in-fight"). Fixed by sampling a matching moment (4 s in, still inside the 5 s
spawn invulnerability so the HP-length probes keep pinning a FULL bar) — i.e.
**the harness's state definition was corrected, the assertion was not re-fitted**
(§6 Risk 1). An audit guard then caught the first attempt calling `sim.tick()`
from a scene; it now steps `advance()` in clamp-sized bites instead.

## SESSION 14 — A1: `Sim` becomes N-actor (2026-07-26)

**A pure generalisation, and the claim is checkable rather than assertable.**
`Sim` was `Record<'player' | 'enemy', FighterState>` — the 1v1 assumption was in
the *type*, consumed by seven `SimEvent` variants and five method signatures. It
is now **a player plus an array of enemies**, with the duel as the array-of-one
case. `tests/duel-baseline.test.ts` was **not edited** and stayed green: all 24
good-play frame counts, all 24 no-play frame counts, the seed-7 checksum
fingerprint and the 10.575 s median are byte-identical to `335e615`.

### Decisions (each with its veto)

- **`FighterSide` → `ActorId = 'player' | \`enemy${number}\``.** Enemies are
  named by SPAWN INDEX (`enemy0`, `enemy1`, …), and spawn order is also the
  fixed iteration order everywhere — which is what keeps a crowd deterministic.
  Chosen over numeric ids because ids appear in every event and every test
  failure message, and because `core/` bans numeric literals.
  > **Veto:** numeric actor ids. Costs readability, buys nothing.

- **Constructor is now `new Sim(rng, SimSetup, autoController)`.** The standalone
  `opponent: OpponentController` positional is gone; each enemy arrives as an
  `EnemySlot { spawn, controller }`. Bundling them prevents the index-aligned
  parallel-array bug, and enforces at the type level that every enemy gets its
  **own** controller instance (controllers carry telegraph/mode state — sharing
  one would interleave several fighters into a single state machine).
  > **Veto:** a separate `controllers[]` argument. *Recommended against.*

- ⚠️ **The fight now ends when the player dies OR EVERY enemy is dead** — it used
  to end on the **first** death. Identical at N=1, and at N=8 the old rule would
  end an encounter on the first kill *with every other test still passing*
  (kickoff §3.5 F names this as the subtle one). Chaos-proven: reverting it to
  `over = true` turns the two-enemy test RED.
  > **Veto:** none — "first death ends it" has no meaning above N=1.

- ⚠️ **The Focus kill bonus is now paid on EVERY kill, not only the
  fight-ending one** (it is credited to the actual killer, which is why
  `dealDamage` takes an attacker). Identical at N=1. **Flag for A2/A6:** with
  one-hit-kill mobs, an 8-mob encounter pays `FOCUS_KILL_BONUS` eight times and
  could fill the bar far faster than a duel does. That is a *prediction of the
  model*, not a tuning knob — measure it in A6 before touching it.
  > **Veto:** pay the bonus only when the fight ends.

- **A slash still resolves against the NEAREST living enemy only.** The
  structural 1v1 assumption is gone (nothing reads a hard-wired `fighters.enemy`),
  but one swing still fells one foe. **This is deliberate**: D5 ("one stroke,
  every enemy it crosses") is **A3**, and it must be written red-first there.
  The reach budget is already spent exactly once, in `truncateTo`, which is
  precisely what will make that loop safe.

- **`sim.enemy` / `sim.enemyId` are kept as DUEL-ONLY accessors** (§3.5 B
  sanctions this as the one documented exception). Renaming every `DuelScene`
  call site buys nothing and risks D2.

- **Kunai carry their thrower** (`FlyingKunai { proj, owner }`). A kill has to
  credit the actual killer; "the other fighter" only has a meaning at N=2.
  `PROJECTILE_MAX_ACTIVE` stays an ARENA-WIDE cap, not per-thrower.

- **Smoke Bomb with no living enemy** grants its i-frames and does not move the
  player (there is no direction to flee). Unreachable at N=1.

- **An unknown `ActorId` THROWS.** A typo'd id that silently resolved to
  somebody would be an invisible damage bug.

### Chaos plants — all eight watched RED, then reverted

| Plant | Test that bit |
|---|---|
| all-dead rule → "first death" | killing 1 of 2 must not end the fight |
| loop only `enemyActors[0]` | per-enemy controller order + same-frame strikes |
| winner hard-wired to the player | winner is the enemy that landed the blow |
| dead enemies keep acting | a dead enemy is never consulted again |
| targeting ignores distance | Chi Punch hits the nearest, not the first spawned |
| unknown id resolves to the player | unknown id must throw |
| kunai spawn from `firstEnemy()` | thrown from ITS OWN thrower |
| ⚠️ **one `rng()` draw per enemy per tick** | **`duel-baseline.test.ts` went RED** — the crowd-size-dependent stream shift §3 risk 2 warns about, caught by the seed-7 checksum |

### What did NOT need to change

`Sim.nearestLivingTarget()` and `synthesizeStrokePoints()` (AUTO SLASH) and
`resolveSlash(points, target, attacker)` were already the right shape, exactly as
§3.5 J predicted — AUTO SLASH's tests passed unmodified apart from the
constructor call, which is the canary the kickoff nominated. The `game/`
numeric-literal ratchet did **not** fire: the `DuelScene` edits introduced no
new numbers.

## SESSION 14 — A2: trash mobs, one-hit kills, corpses (2026-07-26)

**The largest measured gap between the OG and our build, closed.**
`COMBAT_MEASUREMENTS.md` e-2: *"ORDINARY MOBS DIE IN ONE HIT"* — >15
bar-disappearance events across 3 encounters, and no non-named enemy's HP bar
was ever observed at anything other than 100 % on the last frame it existed.

### The confirmation worth noticing

We implemented the source's `if (level <= 8) { minDamage = 1; defense = 1; }`
override in Phase B while it was **dormant** — both duellists sit at level 9, so
it could not have been fitted to anything. The study pass then **independently
measured** dungeon mobs dealing **exactly 1** damage to a 20-HP player. Two facts
established separately, in agreement. A2 does not author that 1; it spawns
something that lives inside the override.

### Decisions (each with its veto)

- **`lowLevelOverride()` extracted to ONE site** in `core/enemyModel.ts`, shared
  by `deriveEnemy` (dormant, level 9) and the new `core/mobModel.ts` (live). This
  is what makes "mob damage is 1" the rule's OUTPUT rather than a typed constant
  — and it is what the chaos plant bites.
- ⚠️ **Mobs do NOT go through `deriveEnemy`** (P1). `core/mobModel.ts` is a
  separate derivation for a separate AI class: HP is an authored 1
  (`<hp>1</hp>`, and `setLevel` forces it), not `effPlayerDmg × K` = 50. Pinned
  by a test that asserts a mob's HP is **not** the duellist's number.
  > **Veto:** none — routing mobs through `deriveEnemy` is the exact
  > "wrong class" trap `SOURCE_CONSTANTS.md` §3.8 fell into.
- **`MOB_BASE.baseMinDamage` / `baseDefense` are INFERRED and NEVER OBSERVABLE**
  in play, because every mob is level ≤ 8. They exist so the override has
  something to override — which is precisely what makes "raise a mob past level 8
  and both numbers change" a meaningful check rather than a tautology. Recorded
  honestly rather than hidden.
- ⚠️ **NO mob XP reward.** The named duellist's `level × 5 + 45` is CONTRACT-SRC
  for *its* class. There is no measured mob reward, and deriving one by analogy
  would be arithmetic dressed as evidence. `DerivedMob` has no `xpReward` field.
  > **Veto:** add one — but with a source line, not an analogy.
- **`ENCOUNTER_SIZE = 8`** — MEASURED (P8), an 8-enemy dungeon fight is on film.
- ⚠️ **The spawn layout is INFERRED and says so** (D10). `REBUILD_READINESS`
  lists "aggro/spawn geometry" as a known-unknown, so mobs spread evenly across
  `ENCOUNTER_MOB_BAND` (world x 300→750) at one ground line. **A6's duration band
  is the thing that will judge it** — §2 diagnosis (b) is "a wrong spawn spread".
- **Corpses are Sim-owned state**, not a render timer: `FighterState.deathFrame`
  plus a `FighterView.corpseAlpha` the scene reads. 96 frames (4.0 s), linear
  fade over the last 12 (P6). `deathFrame` is `number | null`, not a 0 sentinel —
  `applyStroke` is legal at frame 0, so a frame-0 kill is reachable and would
  have read as "alive".
- **HP obfuscation is NOT implemented** (P10, gate item 18). The original
  multiplies stored HP by a random 2..6 per session to defeat memory scanners.
  That is anti-cheat, not gameplay: reproducing it would be a fidelity error AND
  would make every HP read non-deterministic. There is a **test** asserting mob
  HP is exactly 1 under three different rng streams, so a future session cannot
  "discover" it and faithfully implement a bug-generator.

### Chaos plants — six watched RED, then reverted

| Plant | Test that bit |
|---|---|
| the level-override disarmed | mob damage/defence stop being 1 |
| `MOB_HP` 1 → 2 | mobs no longer die in one hit |
| mobs routed through the duellist derivation | 6 tests, incl. the "not 50 HP" pin |
| corpses despawn instantly | corpse opacity |
| corpse fade 12 → 24 frames | the fade ramp |
| the controller factory called once and reused | one-controller-per-mob |

⚠️ **One plant initially came back GREEN, and the test was at fault, not the
code.** The first "own controller instance" test built a fresh controller on
every factory call and ignored the index, so it could not tell a per-mob factory
from a shared one. Rewritten to assert (a) the factory is invoked once per mob
**with each mob's own index** and (b) the controllers that actually reached the
`Sim` are N distinct objects. Both the shared-instance and index-0 plants bite it
now. *A guard that has never been watched failing is not a guard.*

## SESSION 14 — A3: one stroke, every enemy it crosses (2026-07-26)

`applyStroke` now resolves the **same truncated polyline** against every living
enemy, in fixed spawn order. With one-hit-kill mobs this is what makes a crowd
fight read like the original's — and it is what makes the filmed **11-hit
combos** reachable for the first time.

### Decisions (each with its veto)

- ⚠️ **The reach budget is spent ONCE, by the swing** (D5). `truncateTo` runs
  before the loop and every victim is judged against that same polyline. The
  guarded failure is silent rather than loud: re-deriving the budget per victim
  would make a swing's reach **scale with crowd size**, so a stroke that fells
  two mobs in an empty room would fell four in a busy one. The tests therefore
  pin the NEGATIVE — *who a stroke reaches must not depend on how many enemies
  exist* — across crowds of 1, 4 and 7 with the far mob at a fixed distance.
  > **Veto:** resolve against only the nearest crossed enemy. *Recommended
  > against* — the filmed 11-hit combos require one stroke to fell several mobs.

- **Resolve every victim FIRST, then apply damage.** Two reasons, and the second
  is a bug this ordering caught: (1) each victim is judged against the state the
  swing met, so an earlier death cannot change a later target's severing;
  (2) **Focus must be spent BEFORE any damage lands**, because a kill pays
  `FOCUS_KILL_BONUS` — spending afterwards wipes the top-up the kill just earned.

- **Focus is spent ONCE per swing, not per victim** (P3). Charging per victim
  would penalise the player for the game's core verb at exactly the moment a
  crowd makes it worth using.
  > **Veto:** charge per victim — but then say why a crowd should cost more.

- **The combo counts HITS**, so a stroke through three mobs advances it by three.
  Combo breaks only on PLAYER damage (SESSION13 A2), so an 8-mob encounter chains
  to 8 and 11-chains follow. This is a **free confirmation**, not a fitted
  number: the combo rule and the one-hit rule were established separately and the
  filmed 11-chain falls out of them.

- **`StrokeOutcome.slash` keeps its old meaning** — the NEAREST living enemy's
  result, exactly what it returned while the Sim was 1v1, so `DuelScene` is
  untouched. The full picture is in the `damage` events, which carry each
  victim's actor id. No new API was added for a consumer that does not exist yet.

### Chaos plants — six watched RED, then reverted

| Plant | Test that bit |
|---|---|
| reach multiplied by the living-enemy count | who-a-stroke-reaches, ×3 crowd sizes |
| resolve against the RAW, untruncated stroke | same |
| back to one victim per swing (the A1 behaviour) | 5 of the 9 |
| Focus charged per victim | the Focus-once test *(see below)* |
| Focus spent AFTER damage, wiping the kill bonus | `tests/Sim.test.ts` kill-bonus pin |
| combo advanced once per swing, not per hit | the 8-chain and 11-chain |

### ⚠️ Two honest process notes

**1. A regression I made and the baseline did NOT catch.** The first version of
this loop moved the Focus spend to *after* the damage, which zeroed the kill
bonus. `tests/duel-baseline.test.ts` stayed green — **its fingerprint folds HP
and position, not Focus.** `tests/Sim.test.ts`'s kill-bonus pin caught it. The
baseline is a tripwire for the duel's *shape*, not a proof of total correctness;
the unit suite is not redundant with it.

**2. A guard that came back GREEN twice, for two different reasons.** The
"Focus once, not per victim" test was vacuous in its first two forms: first
because real mobs die in one hit and the kill bonus swamped the spend (fixed with
survivor mobs), then because `focusSpend` clamps at zero and the test had banked
24 Focus against a 48 cost — so one spend and three spends both landed on 0 and
it passed happily while Focus *was* being charged per victim. Now it banks more
than three spends, stays under `FOCUS_MAX` so the crit reset cannot fire instead,
and asserts **exact** values. *A guard that has never been watched failing is not
a guard — and a guard watched failing once can still be vacuous in another
regime.*

## SESSION 14 — A4: EncounterScene + damage popups (2026-07-26)

A separate scene for a crowd fight, and the first time this build shows damage
numbers. `DuelScene` is **not touched** (D3): a duel is a NAMED 1v1 with a VS
card, nameplate and result cards, and an opponent whose HP is derived so the
fight lasts K hits; an encounter is trash mobs that die in one hit. A mode flag
on `DuelScene` is exactly how the one-hit-kill rule would leak into the duel.

### Decisions (each with its veto)

- **`?scene=encounter` routes to it; the duel stays the default boot scene.**
  Everything that measures the duel — above all the in-browser fidelity gate —
  therefore lands exactly where it always did.
- **Popup math lives in `core/damagePopup.ts`**, not in the scene, following the
  `core/fx.ts` precedent (which already owns the droplet integration scenes
  call). The payoff is the zero-numeric-literal purity gate: every measured
  number is *forced* into `config/popups.ts` where its provenance is written.
- ⚠️ **`popupFrame` HAS NO CRIT PARAMETER, AND NEITHER DOES ANYTHING ELSE HERE.**
  `COMBAT_MEASUREMENTS.md` f-10 searched ~845 s of play: *"no 'CRITICAL' popup,
  no gold or oversized popup, and no crit-vs-normal popup pair"*. Encoding a crit
  by size is the obvious thing to reach for and would invent a tell the original
  lacks. The `damage` event's `crit` flag is deliberately ignored. **A guarantee
  made by the signature beats one made by a comment** — information that is never
  passed in cannot leak into the render.
- **Colour encodes direction (e-3, MEASURED):** dark = the PLAYER took it, red =
  an ENEMY took it, matched in 13 of 14 filmed events. ⚠️ The red *hue* was never
  sampled, so it reuses the OG's own recovered authored red rather than inventing
  one. Veto = sample the popup red from a frame.
- **Anatomy is measured, not styled:** rise 13.3 stage px over 200 ms, fading,
  scaling up ×1.5 (the midpoint of the measured ×1.448 wide / ×1.552 tall — one
  uniform scale, because a non-uniform stretch is a claim the corpus does not
  make). The glyph box is the measured 29×40 @1080 converted once to stage space
  (15.5×21.3).
  ⚠️ **The digits themselves are still placeholder blocks** — the right SIZE and
  the right COLOUR, but not yet numerals. Honest placeholder, flagged here rather
  than passed off.
- ⚠️ **`spawnAboveStagePx` is INFERRED.** The corpus records how a popup MOVES
  but never where it is BORN relative to its body. Veto = measure it.
- **`dy` is computed as `ZERO - rise*t`, not `-rise*t`** — the latter yields
  NEGATIVE zero at t=0, which renders identically but compares unequal to +0 and
  quietly poisons downstream equality checks. Caught by a test, not by review.
- **DuelScene gets no popups this session.** The OG shows them in duels too, but
  wiring them would put new pixels in front of the 55/55 gate for no A4 benefit.
  Queued, deliberately.

### Evidence

- Red-first: `tests/damagePopup.test.ts`, 13 assertions, watched RED.
- Suite **592/592** · tsc ×2 exit 0 · eslint exit 0.
- `game/` numeric-literal ratchet fired on the new scene **exactly as the kickoff
  §3.4 predicted**, and reviewing the diff *as the audit surface* caught a real
  fidelity miss: the popup glyph size had been invented (7×12) when it is
  MEASURED (29×40 @1080). Moved to config; the refreshed baseline's 21 admitted
  values are now all HUD layout coordinates and alphas — no gameplay numbers, no
  measured values.
- **Live in the browser** (real mouse drags, not synthetic events): one stroke
  killed TWO mobs, `2 HIT COMBO`, enemy counter 8 → 6, player HP untouched, and
  two popups reading `9` in `0x990000` sitting above their victims.
- **Fidelity gate re-proven on the duel: `PASS — 41 points + 14 scans` = 55/55.**

## SESSION 15 — A2: the SVG→polygon converter (2026-07-26)

The first committed OG art. A1 established *which* shapes the fighter is made of;
A2 turns one of them into TypeScript that compiles into the build. The whole
design is forced by D1: `reference/` is gitignored, so a runtime loader would
work on this machine and fail in every clone, CI run and deploy. The art has to
be **emitted as source**.

### Decisions (each with its veto)

- **The converter lives in `scripts/art/`, not `src/`.** It is build-time
  tooling and never ships; only its OUTPUT ships. `tsconfig.node.json` now
  includes `scripts` so it is typechecked and linted like everything else.
  *Veto:* put it in `src/` — rejected, it would bloat the bundle with a parser
  the game never runs.
- **The wrapper `<g>` translate is IGNORED, deliberately.** FFDec's `d` data is
  already in the shape-local frame whose origin is the part's joint pivot; the
  `<g>` only shifts it into a positive-sized viewport. Baking it in would break
  every animation node in A4. The converter now THROWS if that `<g>` is ever
  anything but a pure translation, because then the assumption would be false.
  *Veto:* none — verified 16/16 against `payload.xml`'s `<shapeBounds>`.
- ⭐ **Strokes are converted too, not just fills.** The OG's heavy black outline
  is a large part of how it reads, and it *widens the silhouette that §2 bar A
  measures* — dropping it would bias the IoU against us for a reason having
  nothing to do with the geometry.
- **`ffdec:original-stroke-width` beats `stroke-width`.** FFDec bumps hairlines
  to 1.0 for on-screen legibility and records the true width separately.
  **Independently confirmed:** `payload.xml`'s LINESTYLE2 widths for shape 2664
  are 30 and 10 twips = **1.5 px and 0.5 px**, which is exactly what the
  converter emits. Taking FFDec's bumped value would have drawn the OG's fine
  crease lines at twice their true weight.
- **Everything unsupported FAILS CLOSED.** Unknown path commands, truncated
  coordinate lists and paths that do not open with a moveto all throw. A
  converter that skips what it does not understand loses a body part silently,
  which surfaces later as §2's permitted diagnosis (b) after hours spent looking
  in the wrong place.
- **Flatten tolerance 0.02 px, coordinates at 3 dp.** The parts are 9–37 px
  tall, so this is ~0.1 % of a limb — far below anything a ≥90 % silhouette IoU
  can resolve, and it survives zooming. Regenerating twice is byte-identical.
  *Veto:* supply a measured requirement and it moves.
- **D3 and D4 turned out to be MOOT for this target.** All 16 fighter shapes are
  100 % flat solid fill, so no gradient is approximated and no bitmap fill is
  skipped. The generated header still states `APPROXIMATED FILLS: none` rather
  than staying silent, and a test fails if that line is ever missing.

### ⚠️ D7's carve-out, and what it is paid for with

`src/game/art/generated/` is exempt from the numeric-literal ratchet. The
ratchet exists to stop INVENTED numbers, and traced coordinates are the opposite
of invented — but the exemption is scoped to exactly that one directory (the
hand-written `types.ts` beside it stays fully ratcheted), and it buys four
replacement guards: a **provenance header** naming the source characterId and
both commands, a **filename/characterId agreement** check, an **APPROXIMATED
FILLS** declaration, and a **no-runtime-loading** scan. A generated file without
provenance is a gate failure, not an exemption.

### The bug worth recording

`classifyEvenOdd` first probed nesting with a point strictly INSIDE each ring.
That classified the OUTER ring of a square-with-a-hole as a hole — because the
centre of such a shape lies inside the hole. Nesting must be probed from a point
ON the ring's boundary: a ring nested inside R cannot contain R's boundary,
whereas it very much can contain R's interior. Caught by the hole fixture on the
first run, and now pinned by its own named regression test.

### ⚠️ A guard that was vacuous, again

Plant 5 ("keep zero-area rings") came back **GREEN**. The degenerate fixture
`M2 2 L5 5 L2 2 Z` welds down to two vertices and is rejected by the
`length >= 6` check *before the area filter ever runs* — so the area guard was
dead while its test passed. Fixed by adding a four-vertex zero-area spur that
only the area filter can reject. This is the third session in a row where a
plant found a vacuous guard rather than a code bug; the plants keep earning
their cost.

### ⚠️ THE BUG THE TESTS DID NOT CATCH — found by looking at it

With the suite green, an original-vs-converted overlay showed a visible **notch
in the crown of the head**. FFDec writes the OG's outlines as **OPEN** paths
whose last point simply *equals* the first, with no `Z`; `weld()` strips that
duplicate vertex, leaving the stroke one segment short of closing. Fills were
unaffected — they are implicitly closed — so every bounds, colour, vertex-count
and NaN test passed while the art was visibly wrong.

The rule is now: a stroke subpath is closed if it says `Z` **or** if it returns
to where it started. Both halves matter and both are pinned — force-closing
*every* stroke instead grows a phantom edge across the ear crease, which is
plant 15.

**Process note:** three numeric tests and a NaN sweep could not see a hole in a
line. The kickoff's insistence on rendering at each step (A3 before A4) is doing
real work — this cost five minutes at A2 and would have been diagnosed as a
"pivot problem" at A4, one of §2's two permitted diagnoses, and the wrong one.

### A fail-open closed while writing the A3 kickoff

`convertShapeSvg`'s matcher only recognises the SELF-CLOSING `<path/>` form.
FFDec always emits that, so the risk was theoretical for this pipeline — but the
failure mode is the worst one available: every path skipped, the shape returned
silently EMPTY, and no symptom until someone notices a limb is missing. That is
§2 diagnosis (b) with the evidence erased, and it contradicted the file's own
stated rule that everything unsupported fails closed. Now: if the file declares
more `<path>` elements than the matcher can parse, it THROWS; and a shape that
yields no geometry at all THROWS. Confirmed non-false-positive by converting all
16 fighter shapes (only 2664 is committed — D2 keeps A2 to one target).

### Chaos plants — seventeen watched RED, then reverted

All 13 bit: even-odd→nonzero winding · interior-vs-boundary probe · implicit
repeated commands dropped · unsupported commands skipped · degenerate rings kept
· tolerance ignored · FFDec's bumped stroke width · `<g>` translate baked in ·
truncated coordinates returning 0 · provenance header stripped · approximation
declaration hidden · characterId falsified · a `fetch()` added to generated art ·
outline closure dropped (the crown notch) · every stroke force-closed ·
unparseable `<path>` skipped · an empty shape accepted.

## SESSION 16 — R1/R2: the adversarial review of A2, and its fixes (2026-07-27)

**Method.** 28 agents: 6 finder dimensions (parser · numeric/rounding ·
geometry/topology · fail-open · test vacuity · provenance/gates), each required
to EXECUTE a reproduction before a finding could be filed, then one adversarial
skeptic per finding whose brief was to kill it. **18 raw confirmations → 7
deduped findings · 3 refuted outright · 75 candidate claims dropped by the
finders themselves before filing · 6 of the 10 seeded suspects REFUTED with
evidence.** Two findings were verified against ground truth OUTSIDE this repo
(the SWF's own `DefineShape4` bitstream and FFDec's `-format shape:png` render),
which is why they survived. An eighth finding came from re-planting A2's own
guards after the refactor.

⚠️ **The review's own honest limit, recorded because it bounds every number
below:** no renderer existed, so four of the five "wrong pixels" figures came
from rasterisers the reviewing agents wrote themselves. Only the paint-order
figure was scored against an external reference render. Treat finding 1 as
measured and findings 2–3 as strongly indicated.

- **1. PAINT ORDER WAS DISCARDED — `fills[]`+`strokes[]` → ONE ordered
  `paints[]`.** *(NEW, high, found by 3 dimensions independently.)* A SWF shape
  is a sequence of style GROUPS and a `StateNewStyles` record starts a group that
  paints OVER the previous one, so a stroke can be authored UNDERNEATH a fill.
  Shape **2662** — one of the 16 fighter shapes — is document order
  `S F F F F F F F F S`: a 2.5 px black outline, then eight face fills. Scored
  against FFDec's own 16× render of 2662, source order agreed on **44513/44513**
  opaque pixels and fills-then-strokes on **32952** — 26.2 % of the shape's ink
  turned black, swallowing the nose, lips and jawline. 132 of the 1822 exports
  put a stroke first; 162 genuinely interleave, so no sort can reconstruct it.
  Nothing committed was wrong (2664 is `F S S`, where the two orders coincide) —
  it would have fired the moment the other 15 were generated.
  **DECIDE-AND-FLAG:** the review's smaller option was a `z` index on each
  paint; ONE ordered array was chosen instead because with a `z` field a
  renderer that iterates fills then strokes still compiles, still runs, and
  silently reproduces the bug. Here the wrong order is unrepresentable. It cost
  a regeneration of `shape2664.ts` (structure only — the coordinate multiset is
  unchanged, verified by diffing the extracted numbers). *Veto: swap to `z`.*
- **2. ALPHA WAS SILENTLY FLATTENED TO OPAQUE — now FAILS CLOSED.** *(NEW,
  high.)* FFDec writes SWF fill alpha as `fill-opacity`; nothing in the art path
  ever read it and `ArtFill`/`ArtStroke` have no channel for it, so **130 corpus
  shapes** converted without complaint into fully opaque art — 8 of them turning
  a 100 %-invisible paint fully visible. A fail-OPEN in a file whose header
  promises fail-CLOSED. **DECIDE-AND-FLAG:** the converter now THROWS rather
  than gaining an alpha field — no shape in the current import set carries
  opacity (all 16 checked, zero hits), and adding the field would change the
  emitted format and commit the unwritten renderer to honouring it for zero
  present benefit. Same treatment as gradients (D3) and bitmap fills (D4).
  *Veto: implement alpha end to end, with the renderer, against a shape that
  needs it.*
- **3. THE HOLE CLASSIFIER MISREAD ABUTTING RINGS AS NESTED.** *(seeded suspect
  5, medium.)* `boundaryProbe` bet the whole verdict on ONE point — the midpoint
  of the ring's longest edge — and its docstring named the wrong hazard: it
  guarded against another ring's VERTEX, when FFDec tessellates abutting regions
  of one even-odd path along a byte-identical shared EDGE, frequently the
  longest. `pointInRing` has no on-boundary tolerance, so the verdict was
  effectively arbitrary and **order-dependent**: two abutting solid 100 px²
  squares classified as `[true,false]` one way round and `[false,true]` the
  other, violating the order-independence the suite already asserted for the
  nested case. 24 rings across 19 real shapes were emitted wrong, up to 345 px²,
  and the gap survives painter's-order compositing. **The 16 fighter shapes are
  CLEAN** (0 mismatches; nearest probe-to-sibling 0.0534 px), which is why
  nothing visible was wrong. Fixed by probing per PAIR from candidate edge
  midpoints, longest first, skipping any that sits on the sibling — which
  reduces to the old behaviour whenever nothing touches, so `shape2664.ts` is
  byte-identical. A fully coincident ring pair now THROWS instead of guessing.
  ⚠️ **NOT FIXED, and recorded as a known limit:** ~5 ring pairs in the wider
  corpus genuinely OVERLAP (probe 0.009–0.09 px inside a sibling). A per-ring
  `hole` boolean cannot represent a partial overlap under any epsilon. None is
  in the 16.
- **4. THE CONVERTER'S TESTS DID NOT EXIST OUTSIDE ONE LAPTOP.** *(NEW,
  medium, found by 4 dimensions.)* `tests/svgShape.test.ts` read a gitignored
  `reference/` SVG in a describe CALLBACK BODY, which runs at COLLECTION time.
  Measured in a fresh clone: the file threw before a single test ran, all 44
  tests vanished (**639 → 595**), `npm test` exited 1, and the 36 fixture tests
  that need no reference art died as collateral. The push-time CI workflow runs
  `npm test` on a bare `actions/checkout`, so every fail-closed guard A2 built
  was providing zero protection in the only place that runs unattended. Fixed by
  splitting: the COMMITTED artifact carries every assertion about the art and
  runs everywhere; re-derivation from the SVG is `describe.skipIf`-gated and
  reads lazily inside each `it`. Now **656 passed | 8 skipped** with no
  `reference/`, exit 0.
- **5. THE D7 CARVE-OUT'S STATED PAYMENT WAS NEVER MADE.** *(seeded suspect 10
  + two new angles, medium.)* The provenance gate grepped HEADER TEXT and never
  read the DATA, so a mirrored, translated, recoloured, stroke-amputated or
  id-forged generated file passed 639/639 tests, both typechecks and lint —
  while the block comment claimed the exemption was "paid for by the provenance
  gate below". Now the header is a CHECKSUM: identity triple (header id = const
  name = data `id` = filename, EXACT — the old check used
  `basename.includes(id)`, which also accepts `shape12664.ts`), counts, and a
  new `palette` line so "colours are BYTE-EXACT" is checkable at all. An
  unparseable CONTENT block is itself a failure. Text-level so it runs in CI.
  Plus a byte-for-byte re-derivation test, which required extracting the pure
  emitter to `scripts/art/emit.ts` — `generate.ts` calls `main()` at module
  scope, so importing it from a test ran the CLI and threw, which is why nothing
  had ever referenced `TOLERANCE` from a test.
  ⚠️ **HONEST LIMIT, written into the test:** `emit()` derives header and data
  from the SAME object, so these clauses can never catch a CONVERTER bug — only
  tampering after the fact. Converter drift needs the re-derivation test, which
  only runs where the gitignored corpus exists.
- **6. `WELD` WAS PINNED BY NO TEST ANYWHERE IN ITS PLAUSIBLE RANGE.** *(medium,
  test-only fix.)* `WELD = 1` punches a phantom hole through the committed head
  and deletes 24 of the 86 fighter rings, and the full 639-test suite stayed
  green even after regenerating the artifact from the mutant. Three fixtures now
  pin it. Includes a deliberate NEGATIVE plant (`WELD = 1e-2`, provably
  output-identical to shipped) that must stay GREEN, so the pin cannot fire
  spuriously on a harmless future tweak.
- **7. THE BOUNDS TEST ASSERTED THE OPPOSITE OF ITS NAME.** *(NEW, medium,
  test-only fix.)* "produces a non-trivial outline whose bounds match the SVG
  header" was four ONE-SIDED assertions, all in the direction that permits
  shrinkage: they required the bounding box to sit INSIDE the header window and
  never to FILL it. The head could shrink to a 0.64 × 0.76 px speck, or slip its
  pivot by ±1.5 px, and stay green — including the "subtler non-20× units
  error" that §3.4 and the test file's own docblock both claimed was pinned. It
  was not. Now two-sided, and chaos-proven against a 2× shrink (not just 20×).
- **8. THREE GUARDS HAD NO TEST AT ALL — found by re-planting, not by the
  review.** The `<g>` pure-translation throw (A2's, and the guard the entire
  shape-local pivot claim rests on: neutering it left all 44 tests green) plus
  two I added in this same session (the stroke-width finiteness throw and the
  coincident-ring throw). **Fourth session running that a plant found a dead or
  missing guard rather than a bug.** A guard never watched failing is not a
  guard — and writing one without planting it is the same mistake in a new coat.

**Refuted, with evidence, so they are not re-litigated** (6 of the 10 seeded
suspects, plus 3 killed by skeptics): a leading `+` appears in **no** `d`
attribute in any of the 1822 exports; `nonzero` fill-rule appears in
**0 of 12112** fill-rule attributes; `emitQuad`'s depth-24 bail is ~17 orders of
magnitude out of reach on real curves; `interiorPoint`'s centroid fallback is
unreachable by a parity argument; `classifyEvenOdd`'s O(rings²) costs 1.48 ms on
the worst real shape (a BUILD-TIME script — not a defect); duplicate attributes
and single-quoted attributes occur 0 times. Skeptics also corrected numbers in
most survivors (172→132 stroke-before-fill, 201→128 files, 6→8 zero-alpha) and
killed three "CI is red today" claims — the CI workflow is not committed on any ref.

⚠️ **Fragility of those refutations, recorded deliberately:** at least eight rest
on this ONE FFDec export run. A different FFDec version or flag set could flip
several at once and re-arm the fail-open branches they dismissed. Nothing
records which FFDec build produced the corpus.

**24 chaos plants, all watched.** 23 planted RED (paint order re-sorted to
fills-then-strokes · both opacity guards deleted · opacity weakened to "skip an
invisible paint" · single-probe classification restored · `WELD` 0.1 and 0 ·
every committed coordinate halved · `TOLERANCE` 0.02→0.05 · a runtime import
added to generated art · a stroke amputated with the header untouched · an
outline recoloured magenta with every count intact · the identity forged · the
CONTENT block mangled · `<g>` purity neutered · stroke-width finiteness removed ·
the coincident-ring throw replaced by a guess · and A2's six original guards
re-planted after the refactor) and **1 planted GREEN on purpose** (`WELD = 1e-2`,
the negative control). Gates: suite **664/664 (40 files)** · without `reference/`
**656 passed | 8 skipped, exit 0** · tsc ×2 exit 0 · eslint exit 0 · `npm run
build` clean.

---

## SESSION 17 — A3: the first observed frame of imported OG art (2026-07-27)

**What landed.** `src/core/artPlan.ts` (an `ArtShape` → ordered `DrawOp[]`
planner), `src/core/inkBox.ts` (SESSION17 §P2's measurement rule as code), and
`src/game/OgArtScene.ts` behind `?art=og` — one imported shape, `SHAPE_2664`
(the samurai's head), drawn beside the procedural fighter at a fixed labelled
stage position. **Nothing had ever been drawn from the imported art before this.**

### The measurement, and what it actually shows
Gate A3-A was **17.141 × 20.160 stage px ±1**, derived by the suite from the
committed artifact rather than transcribed. Measured on canvas under §P2's rule
(alpha ≥ 50 %, transparent background, CSS px at `devicePixelRatio` 1):

```
inked bounds (plan)  x 635.339 .. 652.480   y 285.960 .. 306.120
predicted lit pixels cols 635..651          rows 286..305
MEASURED lit pixels  cols 635..652          rows 286..305     clipped=false
  span    17 x 19    (delta -0.14, -1.16)
  covered 18 x 20    (delta +0.86, -0.16)
reproducible across 3 consecutive reads; devicePixelRatio 1
```

⚠️ **THE HONEST READING, because the delta arithmetic alone is ambiguous.** Of
the four estimates, three are inside ±1 px and one — `spanY`, at −1.16 — is not.
`span` measures outermost lit pixel *centres* and therefore under-reads by up to
1 px by construction; `covered` counts lit rows and over-reads by up to 1. The
true value is bracketed for width (17 < 17.141 < 18) but not for height
(20 < 20.160), because the ink's overhang past row 305 is only 12 % of a pixel
and falls below the 50 % threshold. **The decisive evidence is therefore not the
deltas but the pixel indices: the render lights exactly the rows the plan
predicts, and one extra column at the right edge** — where the rectangle model
treats a single point on a *curve* as a vertical wall and so under-predicts.
That is the ±1 px noise floor §P2 warned about, behaving exactly as described.
**The tolerance was not moved.** (SESSION17 §2 (a)/(b)/(c) were not needed.)

### Colours, byte-exact (A3-B)
Histogram of every FULLY-opaque pixel in the head's region: `0xffcc99` ×125 and
`0x000000` ×49, and nothing else that is not an exact linear blend of the two
(`0x80664d` is 50 %, `0xbf9973` is 75 %, `0x403326` is 25 %). No third colour
entered the render.

### What A3 CANNOT prove, stated so A4 does not inherit a false comfort
**`SHAPE_2664` is `F S S`, so source order and the fills-then-strokes bug render
identically.** This was not left as theory: the chaos plant that re-sorts the
planner to fills-then-strokes left the test
`plans the committed SHAPE_2664 as F,S,S` **PASSING**, and only the synthetic
`S,F` and `F,S,F,S` fixtures went red. **A3's pixels cannot see the SESSION16 R2
defect.** Gate A3-C is a unit test for exactly this reason, and A4 must not read
a green A3 as a paint-order proof.

### Divergences and limits carried forward
- **Hole rings are SKIPPED by the planner.** A3 only — `SHAPE_2664` has none
  (SESSION17 P6). Rings are validated *before* the skip, so a skipped ring is
  never an unvalidated one. **A4 must replace the skip with
  `Phaser.Geom.Polygon.Earcut`**, confirmed present in the pinned build together
  with `Earcut.deviation` (both `typeof "function"`, Phaser 3.90.0).
- **`src/core/` cannot import `src/game/art/types.ts`** — the config-purity gate
  resolves every import including `import type`. The planner therefore
  re-declares its input types structurally; drift is caught at **typecheck** by
  assigning the real `SHAPE_2664` to `ShapeInput` in the test.
- **The canvas is transparent on the `?art=og` route only.** §P2's rule is
  undefined over an opaque background. Every other route is unchanged, and the
  fidelity gate re-ran **55/55** to prove it.
- **A3 says nothing about the composed fighter's scale** (SESSION17 §6 Risk 2).
  One shape at one fixed position, deliberately.

**Chaos plants, all watched red then reverted:** planner re-sorted to
fills-then-strokes · hole ring skipped before validation · origin offset applied
twice (`x:1305` for an expected `x:306`) · `inkBox.clipped` forced true.
**Gates:** suite **690/690 (42 files)** · fidelity gate **55/55** (41 probes +
14 scans, `pass: true`) · `tests/duel-baseline.test.ts` green **and unedited**
(empty `git diff` against `04352a9`) · tsc ×2 exit 0 · eslint exit 0 ·
`npm run build` clean · **0 console errors** on a fresh load · ratchet refreshed
deliberately, its entire diff being `"src/game/OgArtScene.ts": {}` — an empty
multiset, i.e. the new scene contains no numeric literals at all.

---

## SESSION 18 — A4.1: hole rings become triangulation input (2026-07-27)

**The A3-only hole SKIP is gone.** `planShape` now emits a third op kind,
`holedFill`, carrying `{ flatXY, holeIndices }` — `Phaser.Geom.Polygon.Earcut`'s
own argument shape — and `src/game/OgArtScene.ts`'s `drawPlan` calls Earcut and
fans the returned index triples through `Graphics.fillTriangle`. The split is
SESSION18 D1: `core/` may import no packages, so it packs and the scene
triangulates.

### ⭐ THE KICKOFF'S §P4 RECIPE IS WRONG FOR THE FIGHTER'S OWN TORSO

§P4 prescribes "concatenate **the** non-hole ring, then each `hole: true` ring,
into one flat array" — singular. Converting shape **2646 (torso, slot 15)** on
2026-07-27 shows its first fill paint carries **TWO outer rings and TWO holes,
one hole inside each outer**:

```
shape 2646 paint #0  color 0xfeca98
  ring0 out  n= 98  signedArea  153.77  bbox [-9.60,-21.55 ..  9.82, -6.55]
  ring1 out  n= 73  signedArea   58.02  bbox [-1.50, -9.05 ..  8.85,  2.15]
  ring2 HOLE n= 23  signedArea   -4.46  bbox [-7.85,-14.73 .. -4.95,-11.95] → inside ring0
  ring3 HOLE n= 12  signedArea   -3.34  bbox [ 2.05, -5.20 ..  4.85, -3.05] → inside ring1
```

Applied literally, the singular recipe packs `ring0 + ring2 + ring3` and **drops
`ring1` entirely** — a hole cut where the torso is solid, and a missing slab
where it is not. Earcut does not error on a hole that lies outside its outer
ring; it returns a plausible mesh. **This is exactly the failure D1's veto note
predicted** ("the one part that can silently mis-pair a hole with the wrong
outer ring"), and it is live in the fighter, not hypothetical.

⇒ **D-A4.1 — holes are paired with their CONTAINING outer ring, by geometry.**
Each outer ring that owns holes becomes one `holedFill` op; every other outer
ring stays a plain `fill`, so a hole-free shape plans exactly as it did in A3.
A census over all 16 converted shapes puts the corrected scope at **3 packed ops
and 3 hole rings in the 14 fighter shapes** (2646 ×2 ops, 2648 ×1) — which is
the kickoff's "4 hole instances" once 2648 is drawn twice, at slots 6 and 10.

### ⭐ ONE containment implementation, not two — `src/core/ringGeometry.ts`

`pointInRing` / `boundaryProbes` / `distToRing` / `ringContains` were **moved
verbatim out of `scripts/art/svgShape.ts`**, which now imports and re-exports
them. Two callers now ask the same question of the same rings — the converter
asks "how many rings contain this one?" to set `ring.hole`, the planner asks
"*which* ring contains this hole?" to pack it — and a second, drifting copy is
how they silently disagree. That rule already produced **24 wrong verdicts
across 19 shapes** once (SESSION16 R2 finding 3); it is not a rule to retype.
Its epsilon moved to `RING_ON_EPSILON` in `src/config/art.ts` (`core/` allows no
literals). **Proof the extract changed nothing: regenerating `shape2664.ts`
produced a byte-identical file (`git diff --quiet` clean), and the converter's
own 41-test re-derivation suite stayed green.**

### Both ambiguities FAIL LOUD rather than guess
- a hole inside **no** outer ring throws;
- a hole inside **more than one** outer ring throws — innermost-wins pairing is
  deliberately **not** implemented, because no ring in any of the 16 shapes needs
  it (every hole resolves to exactly one owner). ⚠️ **Veto path:** even-odd
  nesting at depth ≥ 3 (an island inside a hole, with its own hole) produces
  this legitimately; implement innermost-wins when a real shape hits it. Until
  then a throw beats a hole punched through solid colour that **no gate in this
  session's silhouette-based bar can see**.

### Also moved into `core/`: the Earcut index fan-out
`trianglesOf(flatXY, indices)` converts Earcut's flat **vertex-index** triples
into `fillTriangle`'s six coordinates. It lives beside the packer because index
arithmetic in a scene is untestable (`tests/no-game-imports.test.ts`) **and**
because the `game/` ratchet fired the moment it was written there — 0/1/2/3
appearing in `OgArtScene.ts`. The ratchet was **not refreshed**; the numbers
moved (`TRIANGLE_VERTS` → `src/config/art.ts`) and `OgArtScene.ts` is back to an
empty multiset.

### Divergences and limits carried forward
- **The planner still cannot see the paint-order defect** — unchanged from
  SESSION17, and §3.1 of the kickoff proves A4 cannot either: `2662` is the only
  one of the 16 shapes with a stroke before a fill and it is **not in the
  fighter**. `tests/artPlan.test.ts`'s synthetic `S,F` and `F,S,F,S` fixtures
  remain the only defence in the repo.
- **Gate A4-A is only half proven here.** This step proves the **packing**;
  `Earcut.deviation(...) === 0` for the four hole instances is a browser check
  and belongs to A4.4. Nothing about holes has yet been rendered.
- **~5 genuinely overlapping ring pairs in the wider corpus** still cannot be
  represented by a per-ring `hole` boolean (SESSION16 P8). None is in the 16.

**Chaos plants — 7 written, 7 watched RED, all reverted:**
1. **the kickoff's own singular recipe** (every hole packed against the first
   outer) → 4 red, headed by `pairs each hole with the outer ring that CONTAINS
   it — the real shape 2646 topology`;
2. `holeIndices` in number units instead of vertex units → 2 red;
3. orphan hole silently dropped instead of throwing → 1 red;
4. ambiguous ownership silently taking the first container → 1 red;
5. `inkedBounds` ignoring packed ops → 1 red;
6. `trianglesOf` reading an index as a flat offset → 2 red;
7. `trianglesOf` dropping the whole-triangles check → 1 red.

⚠️ **A process note worth carrying: the first plant run reported all seven
GREEN and it was the harness, not the guards.** `vitest --reporter=basic` does
not exist in vitest 4 — the runner threw `ERR_LOAD_URL` before executing a
single test, and a naive "no failures printed" check read that as a pass. A
plant harness that cannot fail is worth exactly as much as a guard that cannot
fail. Check the exit code, not the absence of output.

⚠️ **A guard bit a real mistake during this step:** the "no outer ring contains"
throw fired on one of my own test fixtures, whose triangle did not in fact
contain its hole. The fixture was fixed; the code was not.

**Gates:** suite **701/701 (42 files)** — was 690, +12 new hole-packing and
fan-out tests, −1 the retired A3-skip test · tsc ×2 exit 0 · eslint exit 0 ·
`shape2664.ts` regenerated **byte-identical** · ratchet **not** widened ·
all 16 real shapes plan without a throw.

---

## SESSION 18 — A4.2: the other 13 fighter shapes, committed (2026-07-27)

All 14 shapes the idle fighter needs are now compiled into the build. Generated
with the kickoff's own §P7 command; **regenerating all 13 a second time produced
byte-identical files** (`diff -r` against a snapshot, clean).

```
2644 uparm   2646 torso   2648 thigh   2650 stomach  2653 pelvic  2655 neck
2658 lowarm  2667 hand    2670 hair    2672 foottop  2674 foot    2676 crotch
2678 calf                                   (2664 head was already committed)
```
`2641` (training branch) and `2662` (alt head) are **deliberately NOT committed** —
neither is in the fighter (§P3).

### ⭐ A REAL COVERAGE GAP FOUND AND CLOSED, not assumed away

The kickoff says A4.2's art is safe because "provenance and data-verification
gates already cover them". Two thirds true, and the missing third mattered:

- ✅ `tests/game-purity-ratchet.test.ts` **does** enumerate the directory
  (`listTsFiles(GAME_DIR).filter(isGeneratedArt)`) and loops inside its `it`s, so
  the provenance header, identity-triple, counts and palette checks picked up all
  13 immediately — which is why the **test count did not move** even though
  coverage did.
- ❌ **The byte-for-byte re-derivation test was hard-coded to `2664`.** By that
  test's own docstring it is "the ONLY assertion in the repo that can catch the
  converter drifting away from the art the game actually draws" — so committing
  13 more shapes would have left thirteen artifacts that **no gate could hold the
  converter to**. Now directory-driven: a shape added later is covered the moment
  it lands, with no list to remember to extend.

### The committed art now meets the A4.1 packer, in the suite
`tests/artPlan.test.ts` gained a describe over all 14 committed shapes — it reads
the committed `.ts`, never `reference/`, so it runs in every clone and in CI.
It pins the corrected hole scope as an assertion rather than a transcription:
**3 packed ops carrying 3 hole rings across the 14** (2646 → two ops with one
hole each; 2648 → one op with one hole; the other twelve hole-free), which is
the kickoff's "4 hole instances" once 2648 is drawn twice at slots 6 and 10.
Planting the kickoff's singular §P4 recipe turns **6** tests red, two of them
these committed-art ones.

### Divergences and limits carried forward
- ⚠️ **None of the 13 is DRAWN yet.** They are compiled in and planned in tests;
  the composer is A4.3 and the render is A4.4. A green A4.2 says the data is
  sound, not that anything appeared on screen.
- ⚠️ **Equipment art is still unrecoverable** — the doll is bald and unarmed by
  design (slots 3/4/17 are the game's own "none" placeholders), which is why §P8
  rejects a silhouette IoU against the video frames.

**Chaos plants — 2 written, 2 watched RED then reverted:**
1. one coordinate moved `0.4 → 0.41` in **`shape2670.ts` (a NEW file, not 2664)**
   → `re-derives EVERY committed generated shape byte for byte` red, naming
   `['shape2670.ts']`; **the old 2664-only test stayed GREEN**, which is the
   whole point of the new one;
2. `source characterId : 2653 → 9999` in **`shape2653.ts`** → both provenance
   gates red (`filename does not match declared characterId 9999` and
   `identity disagrees — header=9999 const=2653 data=2653`), proving the
   directory enumeration really does reach the new files.

**Gates:** suite **708/708 (42 files)** — was 701, +6 committed-art packer tests
+1 re-derivation sweep · tsc ×2 exit 0 · eslint exit 0 · `npm run build` clean ·
**ratchet baseline NOT refreshed** (`tests/game-purity-baseline.json` unmodified;
generated art is exempt and that exemption is what the gates above pay for) ·
`duel-baseline` green **and unedited** · all 13 regenerate byte-identical ·
nothing from `reference/` committed.

---

## SESSION 18 — A4.3: the composer (2026-07-27)

`src/core/composePose.ts` — 19 recorded animation nodes + 2 aliases + a
slot→shape map → **one ordered draw list, back to front**. Pure, red-first, 18
tests, **7 chaos plants all watched RED**. Gates **A4-B** and **A4-C**.

### ⛔ THE KICKOFF'S GATE A4-B SAYS "17 drawn parts". THE CORRECT NUMBER IS 21.

A4-B reads *"19 nodes + 2 aliases → 17 drawn parts (3/4/17 are empty by design);
slots 7, 11, 16 each draw TWO"*. Its own §P3 slot table — and
`FIGHTER_ART_IDS.md` §2, which cites a decompiled naming line per row — give:

```
21 slots (0–20)
 −3 empty by design (3 weapon · 4 prop · 17 hat, the game's own "none" placeholders)
 = 18 occupied slots
 +3 second parts (slot 7 foottop · slot 11 foottop · slot 16 hair)
 = 21 drawn parts
```

It is an arithmetic slip, not a tolerance, so §2's "the tolerances do not move"
does not apply — but the correction is still **derived, never transcribed**: the
test computes both figures from `OG_SLOT_SHAPES` itself
(`occupied.reduce((n, shapes) => n + shapes.length, 0)`), so the suite owns the
number and cannot inherit the slip. Recorded rather than silently fixed.

### ⭐ THE TRANSCRIPTION IS CHECKED AGAINST THE PAYLOAD'S OWN BYTES

`OG_IDLE_NODES` is 19 rows × 4 numbers typed by hand out of a kickoff, and every
behavioural test in the file would pass just as happily against a typo — a
mistyped `y` is invisible until it surfaces as a limb 10 px out of place, which
is exactly the diagnosis §2 forbids guessing at. So a `describe.skipIf`-gated
suite re-parses `reference/extracted/bindata/108_1t4635s0.bin` and compares node
for node. **Result: 19/19 byte-identical, nothing added, nothing dropped.**
Planting a single digit transposition (torso `y −68 → −86`) turns it red.

The same suite also **confirms the aliasing rule from DATA rather than from a
code comment**: the source frame omits slots 8 and 17 and *only* those — exactly
the two the AS3 aliases.

### Decisions
- **The node list is stored in the XML's own DOCUMENT order, deliberately.**
  Z-order is CREATION order (slot 0 back → slot 20 front), and the AS3
  constructor pushes nodes in *reverse* document order, so "iterate the XML" and
  "creation order" are two different sequences (§2 diagnosis (d)). Storing
  document order means a composer that iterates the array is WRONG and a test
  can see it — which is what plants P1 and P2 demonstrate.
- **`OG_SLOT_SHAPES` is indexed BY SLOT**, so the array's own indices are the
  creation order; the returned list is already back-to-front and a renderer just
  walks it. Wrong order is therefore not expressible without extra work — the
  same reasoning that made `paints` one ordered array in SESSION16 R2.
- **Three broken-pose cases THROW rather than skip:** a slot with art but no
  node (the stranded-crotch bug the alias rule was originally found by), an
  alias pointing at a slot the pose lacks, and an aliased slot that *also*
  carries its own node.

### Divergences and limits carried forward
- ⚠️ **INFERRED, and the only inferred thing in `ogPose.ts`: the ORDER WITHIN a
  two-part slot** (calf before foottop, head before hair). It follows the
  construction order in `FIGHTER_ART_IDS.md` §2, the best evidence available, but
  no frame proves it. **Veto = a frame showing hair behind the head.**
- ⚠️ **The 17←16 alias is UNOBSERVABLE in shipped data** — slot 17 is empty by
  design, so the real pose draws nothing for it. It is pinned against a synthetic
  slot map instead; otherwise half the aliasing rule would be carried by a
  comment and would silently misplace a hat the day hat art exists.
- ⚠️ **NOTHING IS RENDERED YET.** A4.3 is a pure function and its tests. The
  first composed frame is A4.4, and A4-D/E/F (proportions, ratios, height) are
  measured there. A green A4.3 says the WIRING is right, not that it looks right.

**Chaos plants — 7 written, 7 watched RED then reverted:**
1. parts ordered by the XML's node sequence → 3 red (A4-C);
2. z-order reversed → 4 red;
3. aliases dropped → **15 red**, headed by the stranded crotch;
4. one shape per slot → 4 red (both foottops and the hair vanish);
5. degrees passed through unconverted → 3 red;
6. the "art but no node" throw removed → 1 red;
7. the alias-collision throw removed → 1 red.
Plus an 8th against the DATA: torso `y −68 → −86` → the transcription suite red.

**Gates:** suite **726/726 (43 files)** — was 708 · tsc ×2 exit 0 · eslint exit 0
· `src/core/` purity green (zero numeric literals; `HALF_TURN_DEG` does the
degree→radian conversion) · `duel-baseline` green **and unedited** · ratchet
baseline untouched.

---

## SESSION 18 — A4.4: the whole fighter, on screen and measured (2026-07-27)

**`?art=idle` draws the composed OG fighter — 21 parts, 90 draw ops, at the 19
node transforms the payload records.** First composed frame of imported OG art in
this repo. Gates **A4-A ✅**, **A4-C ✅**, **A4-F ✅**; **A4-D ESCALATED** (below);
A4-E not gradeable for the same reason as A4-D.

### ⚠️ A STEP THE KICKOFF DOES NOT MENTION: `planShape` CANNOT ROTATE

A4.4 says "reuse `drawPlan`", which covers the drawing but not the transform.
`planShape` only ever translated and scaled, because A3 drew one shape at one
fixed place. A composed pose needs every part turned about its own joint pivot.
New `src/core/planPose.ts` does it — rotating the shape's LOCAL coordinates and
letting the existing planner do the rest, rather than growing `planShape` a
fourth parameter the A3 route would always pass as zero.

The order is **rotate → offset → scale → anchor**, and all three ways of getting
it wrong are pinned as negatives: rotating about the stage origin, rotating the
wrong way (Flash's y-axis points DOWN, so a positive angle is clockwise and the
standard matrix is already correct), and offsetting before turning.

### GATE A4-A — PASS. Four hole instances, `deviation` at floating-point zero.
```
verts=136 holes=1 tris=136  deviation 4.93e-15     (2648 thigh, slot 6)
verts=136 holes=1 tris=136  deviation 1.06e-15     (2648 thigh, slot 10)
verts=121 holes=1 tris=121  deviation 1.72e-15     (2646 torso, outer ring 0)
verts= 85 holes=1 tris= 85  deviation 8.84e-15     (2646 torso, outer ring 1)
```
⚠️ **Read honestly: these are ~1e-15, not literal `0`.** `Earcut.deviation`
returns a signed area residual, and on stage coordinates of magnitude ~500 a
value of 1e-15 is zero to double precision — roughly 1e-17 of the polygon area.
The gate's "=== 0" is met in the only sense floating point allows. The count is
also exactly the four A4.1 predicted: **2646 contributes two** (its two outer
rings own one hole each) and **2648 one, drawn twice** at slots 6 and 10.

### The silhouette read agrees with the plan, inside the declared noise floor
```
plan   52.661 x 128.164 stage px
canvas span 52 x 127   covered 53 x 128   clipped=false   dpr 1
deltaSpan    (-0.66, -1.16)      deltaCovered (+0.34, -0.16)
```
`covered` is inside ±1 on both axes; `spanY` is not, for the reason SESSION17 §P2
declares — `span` measures pixel CENTRES and under-reads by up to 1 px by
construction while `covered` counts rows and over-reads by up to 1.

### GATE A4-F — PASS. **128.164 stage px** against §P9's kasa-less **131.8** —
**2.8 % low**, inside ±5 %. Derived by the suite (`tests/planPose.test.ts`) from
the committed art, then confirmed on the canvas; not transcribed.

### ⛔ GATE A4-D — ESCALATED. IT INHERITS THE EXACT FLAW §P8 REMOVED FROM THE IoU.

Measured from the plan, at every candidate definition:

| measure | ours | §P9 target | ratio | |
|---|---:|---:|---:|---|
| torso length *(neck-top → pelvis-bottom)* | 60.67 | 59.9 | **1.013** | ✅ |
| total height *(A4-F)* | 128.16 | 131.8 | **0.972** | ✅ |
| head Ø *(head+hair)* | 18.37 | 28.4 | 0.647 | ❌ |
| shoulder width *(uparms + torso)* | 34.43 | 42.7 | 0.806 | ❌ |
| mid-torso width | 25.84 | 36.3 | 0.712 | ❌ |
| pelvis width | 27.09 | 37.7 | 0.719 | ❌ |

**Every HEIGHT passes (1.013, 0.972). Every WIDTH misses (0.65–0.81).**

None of §2's four permitted diagnoses explains it, and each was checked, not
assumed: **(a)** the 8←14 alias IS applied — the crotch is placed, visible in the
debug pass; **(b)** slots 7/11/16 DO draw two each — 21 parts; **(c)** rotation
and pivot are right — pinned by tests and the figure is anatomically coherent;
**(d)** z-order is creation order — pinned, and confirmed by eye (far limbs
behind, near limbs in front). §2 then says STOP AND ESCALATE, so the tolerances
have NOT been touched.

**The diagnosis, offered as a FIFTH cause rather than a tolerance change:** §P8
killed the silhouette IoU because *"the only OG images are video frames of an
equipped fighter — so an IoU would grade our bald, unarmed doll against a kasa
and a sword."* **§P9's proportions were measured from those same equipped
frames.** Clothing and armour add WIDTH and barely change skeletal HEIGHT, which
is exactly the split observed. Supporting evidence:
1. both height measures pass; all three width measures fail;
2. the misses are NOT a common factor (0.65 / 0.71 / 0.72 / 0.81) — a scale error
   would be uniform, and A4-F proves the overall scale is right to 2.8 %;
3. our doll is provably bare — slots 3/4/17 are the game's own "none"
   placeholders and equipment art is unrecoverable (`FIGHTER_ART_IDS.md` §5);
4. the render is visibly an unclothed body; the video fighter wears a full outfit.

⇒ **A4-D and A4-E are not gradeable against this doll**, for the same reason the
IoU was not. **Owner ruling required.** The honest replacements, if wanted, are
the two equipment-independent measures that already pass — skeletal height and
neck-to-pelvis torso length — plus the note that §P9's five proportions become
gradeable only if equipment art is ever recovered.

### §6 Risk 2 — the debug-colour pass was RUN, not assumed
`?art=idle&debug=1` paints each of the 21 parts in its own colour. Checked once
by eye: every part distinct and anatomically placed, far limbs behind and near
limbs in front, the crotch placed rather than stranded at the origin, nothing
missing. A silhouette gate cannot see an interior error by definition, and this
is the cheap mitigation the kickoff prescribes.

### Divergences and limits carried forward
- ⚠️ **`Earcut.deviation` is NOT in Phaser's `.d.ts`** though it exists in 3.90.0.
  Reached through `unknown` with a runtime `typeof` check that THROWS if a future
  Phaser drops it — a missing `deviation` must fail A4-A loudly, not silently
  report no holes to check.
- ⚠️ **`src/game/art/fighterShapes.ts` is not test-importable** —
  `no-game-imports` exempts only `art/types.ts` and `art/generated/`, and
  widening that for convenience would trade a live guard away. The test rebuilds
  the map from the generated art and a TEXT-level check keeps the real registry
  from drifting from the slot map.
- ⚠️ **Still not a scale proof** (§6 Risk 1). A4-F ties the fighter to the world
  through two derivations that agree to 2.8 % but share the assumption that the
  fighter clip is scale ≈ 1. This session tests consistency with that assumption;
  it does not establish it.

**Chaos plants — 6 written, 6 watched RED then reverted:** rotation sign flipped
(4 red) · rotation about the stage origin (4) · stroke widths scaled by the
rotation (3) · hole verdicts lost in rotation (3) · missing-shape throw removed
(1) · parts re-sorted inside `planPose` (1).

**Gates:** suite **742/742 (44 files)** — was 726 · tsc ×2 exit 0 · eslint exit 0
· build clean · **in-browser fidelity 41/41 probes + 14/14 scans = 55/55,
`pass: true`, 0 failures** · **0 console errors** on `?art=idle` ·
`duel-baseline` green **and unedited** · ratchet **not widened** — the two new
`game/` files are baselined as `{}`, i.e. zero numeric literals each.

---

## SESSION 18 — A4.5 + the A4-D ruling (2026-07-27)

### ⭐ OWNER RULING — THE WIDTH GATE MOVES TO THE CLOTHED FIGHTER

A4-D was escalated rather than bent (see "SESSION 18 — A4.4"). **Owner ruling
2026-07-27: the answer is not to delete the width targets but to give the fighter
clothes and grade them there.**

- **The BARE fighter** (`?art=idle`) is graded on the two measurements clothing
  does not affect, and both pass: total height **0.972** of target and torso
  length **1.013**.
- **The four WIDTH targets** — head Ø 28.4 · shoulder 42.7 · mid-torso 36.3 ·
  pelvis 37.7 stage px — are **not deleted and not weakened**. They become
  SESSION 19's gate **A5-C**, applied to a fighter wearing traced clothing, which
  is what they were measured from.

Equipment art is unrecoverable from the payload (`FIGHTER_ART_IDS.md` §5), so the
clothes will be **traced from the videos** — permitted by
`docs/OWNER_PERMISSION_RULING.md`, and the opposite of inventing art to close a
gap. ⚠️ **The load-bearing rule, recorded here because it is the only thing
keeping A5-C honest: TRACE, THEN MEASURE — NEVER MEASURE, THEN ADJUST.** The
clothes come from the same footage the targets do, so a garment nudged to hit a
number turns the gate into a mirror.

### ⭐ A STANDING INVARIANT WAS ADDED TO `CLAUDE.md`, from owner correction

> *"it seemed like you were not using the videos I sent as reference — they are my
> most valuable sources, you are supposed to copy those 1:1."*

A4.1–A4.4 were built from extracted SWF data and `combat_idle_measurements.md`,
and no frame was opened until the owner pushed back. **That is exactly how A4-D
came to grade a bare doll against a clothed fighter: the target numbers were
carried forward without anyone re-opening the frame they came from.** The videos
are now a repo-level invariant — open a frame before grading a visual claim, and
when a doc and a frame disagree, the frame wins.

### A4.5 — the regression surface, re-proven on the final state
```
Test Files  44 passed (44)        tsc ×2 → exit 0
     Tests  742 passed (742)      eslint → exit 0        build ✓ in 446ms
bare clone, no reference/:  731 passed | 11 skipped, exit 0   ← run, not assumed
in-browser fidelity:  41/41 probes + 14/14 scans = 55/55, pass: true, 0 failures
0 console errors on ?art=idle
duel-baseline: empty diff against a9592d7 (SESSION17's baseline) — green AND unedited
game-purity-baseline.json: +2 lines only, both `{}`
```
⭐ **The clean-clone run is REAL, not a grep.** `git clone --local` into the
scratchpad (which excludes gitignored `reference/`), `node_modules` symlinked,
full suite run: **exit 0 with 11 tests skipped and no collection failure.** This
repo has broken exactly that way before — SESSION16 finding 4 took the suite from
639 to 595 in a fresh checkout — so it is checked by running it.

### Frame-material findings, banked for SESSION 19
Produced while preparing the next kickoff, and worth keeping regardless:
- **117 of ~700 extracted stills are full 1920×1080** (`duel_dense` 42,
  `duel_seq` 18, `duel_frames` 16, `combat_frames` 16, `zFt_combat` 14,
  `combat_analysis` 5+6). The rest are survey sets at 480×270 or smaller — for
  FINDING a moment, never for tracing.
- ⛔ **THE OVERWORLD IS UNUSABLE AS A TRACING SOURCE AT ANY RESOLUTION.** Pulled
  t=350 s from `zFtCaTO0_1M.mp4` at a true 1920×1080 and cropped: the fighter is
  **~35 px tall** and compression-blurred to a smudge. The overworld camera is
  simply zoomed out. Combat frames put the same fighter at **~270 px**, crisp,
  with readable flat-colour panels and black outlines.
- ✅ **Any moment can be pulled at full resolution** —
  `ffmpeg -ss <s> -i reference/videos/<id>.mp4 -frames:v 1 -q:v 1 out.png`,
  executed and verified at 1920×1080. Survey frames are named in whole seconds,
  so the low-res set indexes the high-res source.
- **A real palette sample** from `duel_frames/Nr4fQstqHDM_t426.8s.png`, crop
  (820,620)-(1020,900): navy haori `#373a4e`, straw kasa `#998a5e`, white hakama
  `#d9d8db`, grey shoulder `#666666`, outlines `#000000`. ⚠️ Video colours —
  lossy and possibly scene-tinted; INFERRED targets, never CONTRACT.

---

## SESSION 19 — A5.1: the tracing frames, and what opening them overturned

Full ledger: `docs/sessions/SESSION19_A5-1_TRACING_FRAMES.md`. Tool:
`scripts/art/outfitFrames.py` (build-time only; reads gitignored `reference/`,
imported by nothing in `src/`).

### D-A5.1a — trace the GREY outfit from `zFtCaTO0_1M`, not the navy one
**Replaces kickoff D2.** `Nr4fQstqHDM` carries a burned-in "SOUND360TM"
watermark, puts a large blue **weapon** across the body in every frame, and only
ever shows a 3/4-back view. `zFtCaTO0_1M` has no watermark, shows the fighter
**alone**, in a **clean side profile — the rig's own view** — with every garment
unoccluded in one frame, and offers a second standing frame 5 s later for D5's
held-out check. Primary `reference/frames/s19_trace/zFt_0061.png` (t=590.0 s);
held-out `zFt_0071.png` (t=595.0 s).
> Veto: trace the navy outfit anyway — same work, with a watermark and an
> occluding weapon. It is the obvious *second* outfit once the pipeline is proven.

### ⛔ D-A5.1b — `reference/combat_idle_measurements.md` IS HUD-CONTAMINATED
On that document's own primary frame `duel_frames/Nr4fQstqHDM_t426.8s.png`:
```
GREEN health-bar rows in x860..1080 :  y 626 .. 634
YELLOW watermark rows in same band  :  y 617 .. 699
measured fighter topmost pixel      :  y 641
```
Its landmark table calls rows **616–638 "Kasa (hat), 22px tall"**. That is the
health bar and the watermark. Every landmark below inherits the shift: the
"head, ~55 px diameter" (650–680) is the **kasa brim**, and "shoulders ~80 px at
row 683" is still hat. With the HUD suppressed and every mask checked by eye,
five frames give **233–243 video px (mean 239 → 127.4 stage px)** where the doc
gives 266/267/274. **Our composed bare fighter is 128.164 stage px — within
0.6 % of that mean.** A4-F's "2.8 % low against 131.8" was graded against an
inflated target; corrected, the sign flips and the error shrinks.

The suppression was itself proven not to eat the hat: in `zFt_0061`, column band
x820–860, rows **636–643** hold the nameplate's drop-shadow, rows **644–648** are
clean background (0 dark px), and the kasa's outline begins at **y649–650**.

⚠️ **This does NOT dissolve A4-D.** Against the clothed frame the shoulder ratio
recovers 0.81 → 0.95, but the pelvis stays 0.68 — which is what a hakama flaring
to 99 video px would do. **SESSION 18's clothing diagnosis survives for the lower
body; the upper-body miss was substantially a measuring error.**
⚠️ **The re-measurement is one frame, one outfit — a first pass, not a contract.**
**A5.5 owes A5-C a fresh multi-frame, per-outfit target set, produced BEFORE any
traced garment is measured against it, or kickoff D1 (trace, then measure) is
quietly inverted.**

### Corrections to the SESSION 19 kickoff's own prerequisites
- **§P7's palette straddled two fighters.** Crop (820,620)-(1020,900) of
  t426.8s contains a grey-clad enemy *and* the navy player; `#666666`
  "grey shoulder armour" is the **enemy's whole haori**. **The player has no
  shoulder armour** — so §4 A5.3's garment list loses an item.
- **§P3's "the overworld is unusable at ANY resolution" is over-general.** True at
  t=350 s (~35 px fighter), false at t=590 s (**233 px**, crisp, and the only
  place the whole outfit is unoccluded). The primary tracing frame *is* an
  overworld frame. What survives: check the fighter's pixel height in the frame
  you actually intend to use.
- **§4 A5.2's "the obi is ≈15 px and is the one at risk" is wrong on size** — it
  is ~44×55 px. Its risk is occlusion, not resolution.
- **§4 A5.0 / §5 item 1's baseline `24c56ef` is one commit stale**; HEAD at the
  start of A5.1 was `8257518` (the kickoff-writing commit), suite 742 green.
- **The large blue diagonal on the navy fighter is the player's WEAPON**, not a
  slash VFX — slot 3, which our art leaves empty by design.

### ⭐ D-A5.1c — the tracing unit is the SLOT, not the garment
§P5 already says equipment replaces a part *by id*; the consequence §4 does not
draw is that a "haori" is not one shape. `OG_SLOT_SHAPES` splits the grey gi
across **15 torso + 13 stomach + 19/1 uparm + 20/2 lowarm**, and the hakama
across **6/10 thigh + 7/11 calf**. A5.2/A5.3 must decide **where to cut a
continuous garment into parts** — a different problem from tracing an outline.

### ⚠️ D-A5.1d — colour alone will not separate the parts
Clusters derived from the mask interior (not hand-picked windows — those returned
the background 3 times in 11): `#dcd5db` 19.9 % hakama · `#676467` 12.6 %
**gi body AND sleeve, one colour** · `#000000` 8.9 % outlines · `#c7c0c6` 3.7 %
collar+obi · `#725422` 2.3 % kasa. **Torso and sleeve share one grey; only the
black outline divides them**, and it reads as a *closed* boundary per part. So
D4's "isolate by colour → 1-bit mask → potrace" needs an outline-driven cut plus
morphological cleanup — the clusters are speckled along every edge by video
compression, and a raw threshold hands potrace the speckle.

### Frames: provenance is now proven, not assumed
Re-pulling t=598.383 s from `zFtCaTO0_1M.mp4` differs from the committed
`session11/movement-gesture/t598.383.png` by **mean absolute difference 0.00**
(the same pull from `Nr4fQstqHDM.mp4` differs by 55.63). That confirms §P4's
recipe and identifies the whole **`session11/` tree — 328 of the index's 448
full-res frames — as coming from the watermark-free video.**

### Rejected, with evidence kept
**The dojo interior.** Tried because its wooden floor would solve the
grass-over-hem defect. Its shoji screens are a **sharp, cream-coloured lattice**,
so the sharpness route locks onto the screen grid and the white hakama has almost
no contrast against cream. Two attempts, one cause, no third. Burst kept at
`reference/frames/s19_dojo/` (t=560–586 s) so the rejection stays checkable.

---

## SESSION 19 — A5.2 (part 1 of 2): the kasa is traced, converted and gated

**⚠️ A5.2 IS HALF DONE.** The ARTIFACT exists, is committed, and is fully gated.
It is NOT yet drawn: `OG_DRESSED_SLOT_SHAPES`, `?art=dressed` and the on-screen
check are the remaining half. Nothing claims otherwise.

⭐ **THE PIPELINE WORKS END TO END WITH NO CHANGE TO THE CONVERTER.**
frame → ink-bounded mask → potrace polygon → SVG → `scripts/art/svgShape.ts`
(untouched) → `src/game/art/generated/shape9017.ts`. §P6's contract — `M L Q Z`
only, flat opaque fills, shape-local coordinates — is met by construction:
```
shape 9017: 2 paints (2 fills), 121 verts → src/game/art/generated/shape9017.ts
bbox x -20.912..26.643  y -27.249..-5.916  = 47.55 x 21.33 world px
```

### ⛔ D-A5.2a — TRACED ART GETS ITS OWN IDS, ITS OWN SOURCE DIR, AND ITS OWN HEADER
A blocker the kickoff does not mention: **the provenance gate hard-coded an FFDec
extraction command**, and the re-derivation test resolved every shape's source
from `reference/extracted/shapes/<id>.svg`. A traced shape could only satisfy
either by claiming an extraction that never happened — in the one repo where
provenance is the entire discipline. So:
- **ids ≥ 9000 are traced and nothing else is** (`TRACED_ID_MIN`), and the kasa
  is **9017** — the id names its slot;
- traced SVGs live in `reference/traced/`, and `sourceSvgRelPath(id)` is the ONE
  place that mapping is decided, so `generate.ts` and the re-derivation test
  cannot disagree about where a committed shape came from;
- `emit()` derives the header from `art.id` alone — **not** from a new parameter,
  which would have broken byte-identical re-derivation at every existing call
  site — via a committed `TRACED_SOURCES` table naming frame, video, timestamp,
  crop, approximations and inferences.
- **The provenance gate now checks BOTH directions.** Traced art claiming an
  FFDec export fails; payload art claiming to be traced fails too. A one-way
  check would have waved the second one through.
> Veto: put traced art in a separate directory with its own duplicated gates —
> rejected, because the count/palette/identity gates on `art/generated/` are
> exactly the ones traced art most needs.

### ⚠️ D-A5.2b — THE PIVOT CANNOT BE REGISTERED FROM THE FRAME. IT IS INFERRED, AND SAYS SO.
Slot 17 is aliased to slot 16, so the kasa's (0,0) must be the head's joint
pivot. Three attempts to register it against the frame failed, and the third
explained the first two: **the fighter in the tracing frame wears different head
art.** Its hair mass measures **20.4 × 24.0 world px** against our shape 2670's
**14.2 × 15.0** — a different shape, not a different threshold. Colour-based
head segmentation also failed twice (hair and the gi's outline are both black and
connected). So no frame registration better than ~±6 world px exists.
**The traced OUTLINE is measured; the PLACEMENT is INFERRED** — the kasa is
centred on our own head+hair union with its brim 40 % down that head, the one
ratio the frame does give — and the emitted header says so in an `⚠️ INFERRED:`
block that the gate requires. Veto = any evidence of the OG's own hat pivot.

### ⚠️ D-A5.2c — TWO NESTED FILLS, NOT FILL + STROKE
The kasa's dark band is **thin along the top edges and thick under the brim**, so
a constant-width stroke cannot express it. The silhouette is emitted as a black
fill with the enclosed straw painted over it; paint order is load-bearing and
back-to-front here means black first.

### ⚠️ D-A5.2d — THE STRAW IS NOT ONE FLAT COLOUR, AND THE HEADER SAYS SO
§P7 prescribes the modal colour of the flattest interior. Measured here, **after
a 5×5 median the mode still holds only 1.3 %** of the interior — the hat is
two-tone with woven texture streaks. So the fill is the interior **mean**
(`#8e6f38`), and the flattening is declared in `APPROXIMATED FILLS:`. Using a
1.3 %-share mode would have been precision theatre.

### Findings that cost real time, recorded so they are not re-paid
- **Isolating by colour picked the BACKGROUND.** The blurred scenery is the same
  warm family as straw and, in this frame, *brighter* than the hat. A5.1's F6
  arriving on the first garment. The fix is the property that actually holds:
  every OG part is bounded by a CLOSED heavy black outline, so a garment is
  "the region enclosed by ink", never "pixels of the right hue".
- **potrace writes its close command hard against the last number** (`-1z`), so
  a whitespace tokeniser hands `float()` the string `"-1z"` and the trace dies
  half way round the outline. Tokenise with a regex.
- Both of §P9's named silent bugs are handled explicitly in
  `scripts/art/traceGarment.py`: black-on-white subject, and potrace's y-UP.

### Chaos plants — all four RED, then reverted green
```
PLANT 1  traced header also claims an FFDec extraction     2 failed | 75 passed
PLANT 2  traced header declares nothing INFERRED           2 failed | 75 passed
PLANT 3  payload-extracted 2664 claims TRACED FROM VIDEO   3 failed | 74 passed
PLANT 4  one traced coordinate nudged (byte re-derivation) 1 failed | 76 passed
REVERTED                                                        77 passed (77)
```
The two gate changes were themselves red-first: generating `shape9017.ts` turned
the provenance gate and the directory-wide re-derivation test RED (742 → 740)
before either was touched.

---

## SESSION 19 — A5.2 (part 2 of 2): the kasa is ON SCREEN. A5.2 CLOSED.

`?art=dressed` → **22 parts**, `?art=idle` still draws the bare 21, **0 console
errors** on a full page load. Suite **747 green** (was 742, +5 new).

### ⭐ D-A5.2e — THE TRACING SETTINGS ARE CHOSEN BY MEASUREMENT, NOT BY EYE
Kheshav's read of the first traced kasa was "the hat is a bit pointier" and "the
red does not really match". Both are edge-localisation complaints, so both were
settled against ground truth rather than argued — SESSION18's trick: take shapes
whose exact vector data we hold, shrink to video scale, degrade, trace back,
score. Mean IoU over 2664 / 2670 / 2646 / 2653:
```
  base (threshold at 1x — what A5.2 part 1 shipped)   0.9735
  up4  (bicubic 4x, then threshold)                   0.9825
  up8                                                 0.9822   plateaus, 2x verts
  up4 + Douglas-Peucker 0.10                          0.9831   BEST, verts ~= base
```
**He was right.** Upscaling before thresholding does not invent detail; it puts
the boundary nearer the true 50 % crossing, which is exactly what a sharp corner
needs. `up4+dp.10` **cuts the remaining error by 36 %** against base. Both
constants are now in `traceGarment.py` with the table beside them.
⚠️ **This is the ceiling, not a promise.** §P9's caveat stands: the harness
degrades a CLEAN render, and a real frame adds clutter and blur.

### ⚠️ D-A5.2f — THE BRIM "NOTCH" IS ≤4 px AND IS DELIBERATELY LEFT
Measured rather than eyeballed: the silhouette's bottom edge has median 52,
range 46–56 (crop-local), i.e. a **≤4 video px ≈ 1.8 world px** hair inclusion
under the brim centre — not a missing brim. It is left as traced because it sits
exactly where the head is drawn BEHIND the hat (slot 17 paints over 16), so it
cannot show, and any closure is inferred reconstruction that risks eating real
brim. Veto = clip the bottom edge to a fitted brim line.

### ⚠️ THE BLACK OUTLINE IS THERE — "MISSING" WAS BLACK-ON-BLACK
First look at `?art=dressed` suggested the hat had lost its heavy outline.
Scanning the rendered pixels found a dark band (`#0f0d09`–`#18140d`) across the
full width below the straw: the outline renders correctly and is invisible only
because the canvas is TRANSPARENT on this route and the page behind it is black.
Putting any backdrop behind it shows the outline at the source's weight.
**A visual claim about a transparent canvas is not gradeable against black.**

### ⚠️ KNOWN GAP, NOT FIXED: THE STRAW READS DARKER THAN THE SOURCE
Side by side at matched scale, the rendered straw is visibly darker/more olive
than the frame's. That is D-A5.2d's interior-MEAN decision showing: the hat is
two-tone (lit upper-left slope, shaded right) and a single mean matches neither.
**The honest fix is a two-fill kasa**, and it is deferred to A5.3 on purpose —
every other garment raises the same question, and answering it once for all of
them beats a rushed recolour. Declared in `APPROXIMATED FILLS:` meanwhile.

### The wiring
- `OG_DRESSED_SLOT_SHAPES` in `src/config/ogPose.ts` — **a second array, never a
  modified one** (D3), derived from the bare map so it cannot drift structurally.
  A test pins that it differs in **slot 17 and nowhere else**, so A5.3 adding a
  garment is a deliberate act.
- `?art=dressed` swaps the slot map and nothing else; `?art=idle` is untouched,
  which is what keeps SESSION 18's height evidence checkable.
- ⭐ **A STATED WEAKNESS RETIRED.** The 17←16 alias was pinned only against a
  SYNTHETIC map holding a made-up id `7000`, because slot 17 was empty in all
  shipped data. It is now pinned against the art the game actually draws.
- ⛔ **The registry gate caught 9017 the moment it landed** — it asserted
  FIGHTER_SHAPES names exactly the ids the BARE map needs, and a dressed-only
  shape is not in that set. It now checks BOTH maps, still with exact equality
  both ways, so a registered shape no map names is still dead weight.

---

## SESSION 19 — A5.3: the rest of the outfit. **GATE A5-A MET (5 traced shapes).**

`?art=dressed` → **20 parts**, 0 console errors, suite **749 green** (was 747).
Five traced garments: **9017** kasa→17 · **9012** collar→12 · **9015** gi body→15 ·
**9014** obi→14 · **9011** hakama→**11 AND 7**.

### ⭐ D-A5.3a — THE SLOT IS CHOSEN BY Z-ORDER, NOT BY ANATOMY
z-order is CREATION order, so a higher slot draws IN FRONT. The hakama covers the
whole leg, so it goes on the **CALF (7/11)** — which draws in front of the thigh
(6/10) and the foot (5/9) — and **not** on the thigh, where the bare calf would
paint straight over it. The same reasoning puts the gi on 15 (over 13).

### ⭐ D-A5.3b — ONE TRACED LEG, DRAWN TWICE — WHICH IS WHAT THE OG DOES
⛔ **The far leg cannot be traced from this frame.** Its region is not bounded by
ink on the right, because **the outline there IS the scabbard**, so `fill_holes`
leaks into the background and the silhouette comes back wider than the hakama.
Two attempts to subtract the saya by hue both failed the same way (the second
reached down to r>28 to catch its dark lacquer end and still left the bulge), so
the third was not attempted. **9011 is drawn at slots 11 and 7 instead** — the OG
itself draws 2678 at 7 and 11 and 2648 at 6 and 10. A bare far leg beside a
clothed near leg would look worse and be no more honest.
> Veto: leave the far leg bare until a frame with the scabbard hanging clear is found.

### ⛔ D-A5.3c — THE HAKAMA WAS 18 WORLD px TOO LOW, AND THE OG's OWN DATA FIXED IT
First render put the skirts floating below the hips with bare skin above them.
Cause: a 50.22-world-px leg garment centred on the calf's 26.6-px bbox. **The
correction came out of `OG_IDLE_NODES`, not off the screen** — near thigh at
y −55, near calf at y −29, so the hip sits **26 world px above the calf's
origin**, and shape 2648's own art starts 4.75 px above that. The hakama now
anchors its WAISTBAND at `−26 + −4.75 = −30.75` calf-local. Derived, not nudged.

### ⛔ THE ONE DOMINANT DEFECT LEFT: BARE ARMS PAINT OVER THE GI
The gi body and the near SLEEVE are the same grey and are **not divided by a
closed outline everywhere** (A5.1 F6), so no sleeve could be cut out of this
frame — the single enclosed region covers both and is assigned to slot 15. Slots
19/20 and 1/2 stay bare and **draw IN FRONT of 15**, so a skin-coloured arm still
crosses the chest. Visible in the render, declared in `shape9015.ts`'s header,
and pinned by a test (`leaves the arm slots bare — a KNOWN gap, not an
oversight`) so it cannot be mistaken for something nobody noticed.
**Fixing it needs a frame where the sleeve is separately outlined.**

### Smaller, stated
- **9012 collar** — the enclosed region holds the white collar AND the dark hair
  beside it (shared boundary), so the traced shape is wider than the collar. It
  replaces slot 12 (neck), which everything else draws in front of, so the
  surplus is covered.
- **9014 obi** — 26×24 video px, the smallest garment traced. Inside §P9's
  trustworthy band (≥20 px) but only just.
- **9011 hem** — the bottom few px follow the GRASS, not the cloth (A5.1 crop 7).
- Seeds are the **deepest interior point** of each region (distance transform),
  never "the biggest region" — that picked the background on the first garment.

### The colour question, answered once for all garments — and it was NOT what I proposed
A5.2 left "the straw renders darker than the source" as a gap, and proposed a
two-fill kasa. **Measured, that fix is wrong.** Clustering the kasa's interior at
bucket 32 gives clusters of 33 % / 23 % / 16 % whose y-extents are y23-47,
y20-46, y20-44 — **fully interleaved**, i.e. a graded weave, not two flat panels.
A cluster split would emit speckle rather than panels. **One flat fill at the
interior mean stands**, and the emitted `#8e6f38` IS the source's measured mean.
The perceived darkness is a uniform fill next to a graded region whose highlight
catches the eye. Recorded so nobody re-opens it without new evidence.

---

## SESSION 19 — A5.4: the sleeves, and a mis-assignment corrected

### ⛔ D-A5.4a — A5.3 PUT THE **SLEEVE** ON THE **TORSO** SLOT
Owner feedback ("I see some empty spots, add the sleeves if the source says so")
sent me back to the frame at three ink thresholds, and the region A5.3 called
"gi body" and assigned to slot 15 is **the near SLEEVE** — it carries the round
crest, and the narrow strip beside it is the gi's visible body panel. That single
mis-read is why the arm rendered bare over a vest-sized gi.
**Corrected:** `9019` sleeve → slot 19, `9001` far sleeve → slot 1,
`9015` → the gi's **outer silhouette** on slot 15.

### ⭐ D-A5.4b — SLOT 15 CARRIES THE GI'S OUTER SILHOUETTE, NOT ITS BODY PANEL
The near sleeve hangs over the torso, so the gi BODY is never fully visible and
"the region enclosed by ink" returns only the strip beside the sleeve. The gi's
outer EDGE is visible though, so slot 15 gets `(garment-grey OR ink)`
flood-filled from a seed — the whole gi silhouette — and the sleeve on slot 19
draws over it. That reproduces the layering the frame shows.
⚠️ Where the two overlap the torso is hidden, so its hidden shape is unverifiable
and is declared so in the header.

### ⚠️ D-A5.4c — THE SLEEVE ANCHORS BY ITS TOP, NOT ITS CENTRE
A sleeve hangs FROM the shoulder. Centring it on the upper arm's bbox rides it
down the forearm. Same class of error as A5.3's hakama, caught before it shipped.

### ⚠️ The forearms and hands stay BARE, on purpose
The source's sleeve ends at mid-forearm and the wrist and hand are skin.
Dressing them would be inventing cloth the frame does not show. Pinned by a test.

### ⭐ OWNER DESIGN CONFIRMATION (2026-07-27) — EQUIPMENT IS PER-SLOT AND TOGGLEABLE
Kheshav: *"those clothes can be equipped or unequipped at any time in the menu,
they will be naked like in the picture you showed me before."* This confirms the
architecture rather than changing it: `TRACED` is already a **per-slot override
table**, so each garment is independently equippable, and **the bare fighter is
not scaffolding — it is the real unequipped state**, which is why `?art=idle`
must keep working and why `OG_SLOT_SHAPES` is never edited in place (D3).
It also means a future equip system is a per-slot merge over the bare map, not a
second hand-maintained array.

---

## SESSION 19 — A5.5 step 1: THE TARGET SET, COMMITTED **BEFORE** OUR FIGHTER IS MEASURED

⛔ **This entry is committed on its own, on purpose.** Kickoff D1 says TRACE, THEN
MEASURE — NEVER MEASURE, THEN ADJUST. A5-C's original targets are unusable
(A5.1: HUD-contaminated), so they had to be re-derived — and a target set derived
*after* seeing how the traced fighter scores is a mirror, not a test. So the
targets go in first, with the tool that produced them, and our fighter is
measured against them afterwards.

Tool: `scripts/art/proportions.py` — ONE rule applied to BOTH the source frames
and our own render, so the comparison is like-for-like.

⭐ **A PROFILE, NOT FOUR LANDMARKS.** "Shoulder width" needs a rule for WHICH row
is the shoulder, and choosing that row by eye on a blurred frame is exactly how
the old numbers went wrong. The primary comparison is the whole width-vs-height
profile normalised to the figure's own height. The four landmarks are reported
too, from one stated automatic rule, so A5-C stays gradeable.

**Source: the GREY outfit, lone and standing, HUD suppressed, 13 frames** from
`reference/frames/s19_trace/` (t≈586–599 s, `zFtCaTO0_1M`).

```
                        mean      sd      range
  head              0.1797   0.0347   0.1529 .. 0.2467
  shoulder          0.3279   0.0559   0.2261 .. 0.4280
  midTorso          0.3416   0.0283   0.3120 .. 0.3947
  pelvis            0.3332   0.0553   0.2562 .. 0.4474
  height (video px)  236.7            227 .. 250
```
All four are **fractions of the figure's own height**, so they are scale-free and
cannot be gamed by rendering bigger or smaller.

⚠️ **FOUR FRAMES OF SEVENTEEN WERE REJECTED, BY A RULE STATED BEFORE THE NUMBERS
WERE READ:** height outside 200–280 video px (the mask merged with scenery), or a
head wider than 0.30 of the figure's height (physically impossible under a hat,
so the segmentation failed). Leaving them in moved the head mean from 0.18 to
0.30 and its sd from 0.035 to 0.352. The rejects are printed by name every run.

⚠️ **THE SPREAD IS THE HONEST PART.** shoulder and pelvis carry sd ≈ 0.055 on
means of ≈ 0.33 — that is **±17 %**, and it is mostly POSE, not noise: the set
mixes standing and mid-stride frames. Any grading against these must respect that
band rather than treat the mean as exact. Height alone is tight: 227–250 px, ±5 %.

---

## SESSION 19 — A5.5: measured against the pre-committed targets. **A5-C 3/4 · A5-E strong · A5-D dressed MISSES**

Measured with `scripts/art/proportions.py`, the same rule applied to the source
frames and to our own render, against the target set committed in the PREVIOUS
commit — so nothing here could have been fitted to the answer.

### A5-C — three of four inside ±15 %, against A4-D's four-of-four miss
```
measure    target    ours   ratio          A4-D (bare, old targets)
head       0.1797  0.1780   0.990  PASS      was 0.647
shoulder   0.3279  0.2881   0.879  PASS      was 0.806
midTorso   0.3416  0.2627   0.769  MISS      was 0.712
pelvis     0.3332  0.3390   1.017  PASS      was 0.719
```
⭐ **This is the session's thesis, confirmed.** A bare doll missed all four; a
clothed one, graded against targets re-measured from the frames, passes three.
⚠️ **mid-torso still misses at 0.769.** Diagnosis, from the profile: the miss is
concentrated at **45–50 % of the height** (ratios 0.65 and 0.79) — the band where
the source's sleeve billows widest. Our sleeve is traced from a frame where the
arm hangs against the body, so it carries less width there. This is §2 diagnosis
(a)/(b) territory — a garment traced narrow — **not** a reason to widen a shape.

### A5-E — the held-out check, and it says we are NOT overfitted
Normalised width-profile agreement over 19 sample heights (1.000 = identical):
```
  ours vs the TRACING frame  zFt_0061 (t=590.0 s) : 0.8742
  ours vs the HELD-OUT frame zFt_0071 (t=595.0 s) : 0.8294   <- A5-E
  the two FRAMES against each other               : 0.8808   <- the ceiling
```
⭐ **0.8294 against a frame never traced from, where the source's own two frames
only agree with each other at 0.8808** — so we reach **94 % of the achievable
ceiling**, and we are barely better on the frame we traced from than on the one
we did not. That is exactly the discrimination §6 Risk 1 asked for: a
tuned-to-fit garment would have scored far better on its own source.

### A5-D — the BARE fighter is unmoved; the DRESSED one is too tall
```
BARE    (?art=idle)     52.661 x 128.164 stage px  = 240.3 video px   UNCHANGED
DRESSED (?art=dressed)  63.912 x 140.484 stage px  = 263.4 video px
frames (13, hat included)                            236.7 video px (227..250)
```
✅ **The bare fighter's height is byte-identical to SESSION 18** — `OG_SLOT_SHAPES`
was never edited, and tests pin it. A5-D's literal requirement is met.
⛔ **The DRESSED figure is 11.3 % taller than the frames' mean and 5.4 % above
their maximum. That is a real miss and it is reported, not tuned away.**

**Diagnosis, and it is uncomfortable:** our BARE fighter is **240.3 video px with
no hat**, while the source's fighters measure **236.7 px WITH one**. So the bare
skeleton is already at the top of the source's range, and *any* hat overshoots.
During A5.5 the brim depth was re-derived from the frame — the first value (0.40
of the head's height) was a guess at a head the frame does not show; measured
from the visible collar upward it is **0.60**, and correcting it took the dressed
figure from 144.8 to 140.5 stage px. **The remaining 11 % cannot be closed by
placing the hat lower without burying the head**, so it points at the skeleton or
at the OG's own head/hat proportions, and it is left open rather than fitted.
⚠️ Note the ordering: that correction was derived from the frame's geometry, and
the resulting height is reported whether it passes or not (kickoff D1).

### A5-F — regression, all green
```
in-browser fidelity   41/41 probes + 14/14 scans = 55/55, pass: true, 0 failures
suite                 44 files / 750 tests green   (was 742 at session start)
bare clone, no reference/   739 passed | 11 skipped, exit 0, no collection failure
duel-baseline.test.ts       UNEDITED since a9592d7 (empty diff)
game-purity-baseline.json   NOT touched this session (empty diff vs 8257518)
typecheck x2 exit 0 · eslint exit 0 · ?art=dressed 0 console errors
```
⭐ The clean-clone run is real: `git clone --local` into the scratchpad (which
excludes gitignored `reference/`), `node_modules` symlinked, full suite run —
**`reference/` confirmed absent** and exit 0.

## SESSION 20 — A6.1: the headless render. **GATE A6-A MET.**

**The thesis of the session, restated:** every defect in SESSION 19's outfit was
found by a human eye, never by a gate, while the suite sat at 750 green — because
nothing in the repo compared the rendered fighter to the source. A6.1 is the
first half of the comparison: the planner's own output becomes a file, in
milliseconds, without a browser.

### What landed
```
scripts/art/rasterise.ts       pure engine: DrawOp[] -> pixels -> PNG, zero deps
scripts/art/renderPoseArgs.ts  the CLI's flags, parsed and RANGE-CHECKED
scripts/art/poseRaster.ts      compose -> plan -> rasterise (the pure half)
scripts/art/renderPose.ts      the CLI
tests/rasterise.test.ts        34 tests      tests/renderPoseArgs.test.ts  11 tests
```
`renders/` is gitignored. **Nothing new reads `reference/`; nothing in `src/`
changed at all** — the whole step is build-time tooling plus tests.

### GATE A6-A ✅ — planPose's DrawOps → a PNG from Node, byte-deterministic
```
dressed: 20 parts, 55 draw ops   ink 474.9..538.9 x 290.9..431.4 (63.9 x 140.5)
idle:    21 parts, 90 draw ops   ink 480.5..533.1 x 303.2..431.4 (52.7 x 128.2)
two separate PROCESSES, same output:  cmp png OK · cmp mask OK · digest e9ddfe43b6ea139b
```
⭐ **The `idle` ink is 52.7 x 128.2, and SESSION 18's A4-F recorded the plan as
`52.661 x 128.164`** — the headless render reproduces a number measured before it
existed, against a live canvas, to 0.1 px.

### ⭐ THE PLUMBING IS CHECKED AGAINST A TABLE COMMITTED BEFORE THIS CODE EXISTED
`renderPose --slots` regenerates the kickoff's §P6 per-slot footprints. **All 11
of its rows reproduce to 0.1 stage px** (kasa, collar, gi body, both sleeves,
both hakama, obi, lowarm, foot).
⚠️ **ONE §P6 ROW IS INTERNALLY INCONSISTENT AND IS CORRECTED HERE.** Row `16
head+hair` gives bbox `501.5..519.8 x 303.2..325.3` but size `17.7 x 19.7`. Those
disagree; measured per shape:
```
slot 16 shape 2664 (head) alone: 502.1..519.8 x 305.5..325.3   17.7 x 19.7  <- §P6's SIZE
slot 16 shape 2670 (hair) alone: 501.5..518.3 x 303.2..321.3   16.8 x 18.1
slot 16 head+hair together     : 501.5..519.8 x 303.2..325.3   18.4 x 22.1  <- the truth
```
So §P6's size column for that row is the HEAD ALONE while its bbox is head+hair.
✅ **§P7 defect 1 is unaffected**: it argues from head-bottom `y 325.3`, which is
the same in both readings.

### ⛔ THE DETERMINISM CLAIM I FIRST WROTE WAS FALSE, AND IT MATTERED
The header said `deflateSync` "makes the PNG bytes a pure function of the pixels".
It does not — `deflateSync` output is a function of the zlib Node was BUILT
against. Measured on this machine, same 20 000 bytes at level 9:
```
node v25.8.2  (shared zlib 1.2.12)  -> sha 839bcfde99e8e51a
node v24.14.1 (bundled zlib 1.3.1)  -> sha 6e713876e21a4dc5
```
**And `.github/workflows/ci.yml` pins `node-version: 'lts/*'`, a different build
from the dev Mac** — so a future gate hashing a PNG would have gone red in CI for
no reason anybody could find. **Fix: `rasterDigest()` hashes the PIXELS**, which
use only exactly-specified arithmetic, and the CLI prints it labelled as the
render's identity with the PNG's sha256 labelled build-dependent.
⚠️ One level up: `planPose` rotates with `Math.cos`/`Math.sin`, which ECMAScript
leaves implementation-defined — so a PLAN is only guaranteed stable on a fixed
engine. Stated in the header rather than assumed away.

### ⛔ A COMMENT THIS SESSION WROTE WAS FACTUALLY WRONG ABOUT THE COMMITTED ART
It claimed "every closed OG outline repeats its first point". Measured over all
21 committed shapes:
```
fill rings:        50, of which repeat their first point:  0
stroke polylines:  28, of which repeat their first point:  6
```
⇒ **The implicit closing edge in the scanline filler is LOAD-BEARING, not
defensive**: fill rings are stored OPEN, so dropping the wrap loses each ring's
last edge and leaks the fill across the scanline.
⚠️ Note for later: `drawPlan`'s own comment in `src/game/OgArtScene.ts` justifies
`closeShape: false` with the same "already repeats its first point" claim. 22 of
28 polylines do NOT repeat it — they are open paths, so the CODE is right, but
the stated reason covers only 6 of them. Not changed here (it would move pixels).

### THE STATED DIVERGENCES FROM PHASER — this is a comparator, not a second game
1. fills are scanline-filled EVEN-ODD; Phaser triangulates through Earcut. This
   renderer is therefore **blind to a mis-packed hole ring**, which is exactly
   what `Earcut.deviation` in the live scene exists to catch.
2. strokes get ROUND caps/joins; Phaser uses miter joins and butt caps. At the
   0.6–2.4 stage px widths the art carries this is sub-pixel — and round caps
   agree with `inkedBounds`, which already grows a stroke by half its width on
   every side.
3. antialiasing is a box downsample of `supersample`² hard-edged sub-pixels.
✅ **Checked by eye against the live canvas anyway**, both routes, on a magenta
backdrop: the headless render and Phaser agree on pose, layering and every
garment — including reproducing §P7's two open defects (feet detached below the
hakama hem; the gi rising into the neck).

### THE BACKDROP IS MAGENTA, AND IT IS ENFORCED
`0xff00ff` collides with none of the 14 colours the art uses (black, five tans,
eight greys). `assertBackdropIsNotArt` throws if a chosen backdrop is one the
plan paints — without it, "everything that is not the backdrop is the fighter"
silently deletes a garment and the score IMPROVES.

### 20 CHAOS PLANTS, ALL WATCHED RED — AND 3 OF THEM CONDEMNED THE TEST, NOT THE CODE
Planted, red, reverted: region offset dropped · paint order reversed · hole rings
mis-packed · fill clamping removed · polyline closed (both a crash form and a
proper modulo form) · stroke width as radius · floor-instead-of-round · CRC
zeroed · PNG filter byte wrong · colour type wrong · `Math.random` in the
downsample and in the encoder · fills-then-strokes reordering · stroke colour
ignored · stroke clamping removed · sub-pixel sampled at the corner · coverage
keyed to "not the backdrop" · a fill row dropped (vs the golden digest) · and an
off-stage `anchorX` (vs the clip guard).
⭐ **Three plants stayed GREEN and each exposed a weak test, which was then
strengthened before the plant was re-run:**
1. the hole-ring mis-pack — corner probes still pass when the mis-pack cuts a
   WEDGE out of the flanks, so all four flanks are now probed;
2. closing an L-shaped polyline — the added edge is the DIAGONAL back to the
   start, not the "missing side", so the closing diagonal itself is now probed;
3. (from the review, below) the round-cap negative probe sat OUTSIDE the
   segment's own scan box and passed whatever the cap did — replaced by an
   assertion on the whole ink extent, which cannot pass by accident.

### THE ADVERSARIAL REVIEW — 4 lenses, 21 claims, 15 refutation verdicts, 5 CONFIRMED
Every confirmed finding is fixed, red-first:
| # | finding | fix |
|---|---|---|
| 1 | the PNG determinism claim is false across Node builds | `rasterDigest` + a header that states all three guarantees separately |
| 2 | `--backdrop ff00ff` (no `0x`) → NaN → renders on **pure black** and walks past the backdrop guard | `renderPoseArgs.ts`, range-checked, split out so a test can reach it |
| 3 | the same hole on the **API** path (`renderPose()`, which the comparator and loop are documented to call) | validated in `rasterise()` itself |
| 4 | a value-taking flag swallows the next flag (`--out --slots` writes a file named `--slots`) | rejected |
| 5 | `encodePng` accepts a 0-size image and emits a file no decoder accepts | dimensions validated |
Plus test-strength gaps the review found and this step closed: stroke COLOUR was
never asserted · paint order was asserted only between two FILLS, so the
fills-then-strokes bug the module cites (SESSION16 R2 finding 1) survived the
suite · stroke width pinned only on a 2-point path · IHDR bytes 10/11/12
unasserted · the sub-pixel sampling convention unpinned · the AA blend value only
bracketed (a gamma blend passed) · stroke clipping ungated · the region guard's
HEIGHT arm untested · and `coverage`'s whole reason for existing — ink registers
even where the paint equals the backdrop — untested.

### ⚠️ WHAT IS **NOT** COVERED, STATED SO NOBODY READS THE GREEN AS MORE THAN IT IS
- **`poseRaster.ts` has NO suite coverage, by construction.** It imports
  `src/game/art/fighterShapes.ts` and `tests/no-game-imports.test.ts` forbids a
  test from reaching `src/game/**`. Its two guards are chaos-proven by CLI runs
  against planted defects (recorded above), not by a green test.
- A `main()` at module scope cannot be guarded here: **`vite-node` strips the
  script path out of `process.argv`**, so the usual entry-point check never
  matches. Hence the `emit.ts`/`generate.ts`-style split into a pure module and a
  CLI — the only honest fix, and the comparator needs the pure half anyway.

### Regression, all green
```
suite   46 files / 795 tests   (was 44 / 750 at session start)
tsc x2 exit 0 · eslint exit 0
in-browser fidelity  41/41 probes + 14/14 scans = 55/55, pass: true, 0 failures
?art=idle draws the BARE 21-part fighter · ?art=dressed the 20-part dressed one
0 console errors on a fresh load · duel-baseline UNEDITED · ratchet NOT widened
```

## SESSION 20 — A6.1 (part 2): the review's structural finding, and the gate it forced

**A6.1 shipped at `eff0c2f` with a claim in two file headers that turned out to be
FALSE, and it was the load-bearing claim of the step's test design:** that the
pose pipeline could not be tested, because `tests/no-game-imports.test.ts` forbids
importing `src/game/art/fighterShapes.ts`.

⛔ **`tests/planPose.test.ts` has been building the REAL 90-op idle plan inside the
suite since SESSION 18.** The `art/generated/**` pure-data carve-out allows it —
the map is rebuilt from the generated shapes, and that file's own registry check
pins `FIGHTER_SHAPES` against BOTH slot maps, in both directions, as text. The
technique was already in the repo; A6.1 simply did not look.

### What the untested pipeline was hiding — a review mutated it and the suite did not care
All of these passed typecheck, lint AND all 46 test files, **together, as one mutant**:
```
A  swap slotMapFor's ternary   -> `dressed` renders the BARE fighter
                                  20 parts/55 ops -> 21 parts/90 ops, digest e9ddfe43 -> 6dae62d1
B  delete assertBackdropIsNotArt(plan, backdrop)  -> --backdrop 0x000000 renders happily
C  Math.floor -> Math.round in the crop           -> frame moves 113x190@(450,266) -> 112x189@(451,267)
```
And two more against the rasteriser, which only ever saw 4-op scenes:
```
D  skip strokes on large plans -> deletes ALL 16 dressed / 41 idle outlines, 3.25% of pixels
E  sub-pixel sampled at the corner -> the whole silhouette shifts 0.125 px in one axis
```
**Every A6.2–A6.5 measurement would have been taken from that fighter, with a
green suite.** This is the session's own thesis landing on the session's own work.

### The fix: inject the shape map, so the pipeline lives where a test can reach it
```
scripts/art/poseScene.ts   NEW — slotMapFor · cropRegion · assertBackdropIsNotArt ·
                                 slotFootprints · renderPoseWith(variant, SHAPES, opts)
scripts/art/poseRaster.ts  now THIN: hands FIGHTER_SHAPES to poseScene, formats output
tests/poseRender.test.ts   NEW, 15 tests — the real plan, both variants
```
⭐ **The pixel gate: `rasterDigest` of the real dressed and idle renders is
committed.** Counts, boxes, crops and op censuses are pinned too:
```
dressed  20 parts, 55 ops  {fill 37, stroke 16, holedFill 2}  crop 113x190 @ (450,266)
idle     21 parts, 90 ops  {fill 45, stroke 41, holedFill 4}  crop 102x177 @ (456,279)
dressed digest e9ddfe43b6ea139b24ebb267441265b5faac212204fda3b78b5b349b88359689
idle    digest 6dae62d12576cc22e2b62f92dc7481c5634f6e6c88279d3b5d6be4e97638ca97
```
⚠️ **The digests are a REGRESSION gate, not a correctness one**, and they must
never be "refreshed" to make a diff go green. They are portable — `rasterise`
uses only exactly-specified arithmetic — unlike a PNG hash.

### All five mutations re-planted against the new gate — ALL RED
```
A swap slotMapFor       -> 6 tests red   B delete the backdrop call -> 1 red (after a second pass, below)
C floor->round crop     -> 2 tests red   D skip strokes on big plans -> 1 red (GOLDEN)
E corner sub-pixel      -> 3 tests red   F floor() in the scanline spans -> 1 red (GOLDEN)
```
⚠️ **B needed a second pass, and the reason generalises.** The first version of
the test called `assertBackdropIsNotArt` directly, so deleting the CALL from
`renderPoseWith` stayed green — the function was gated, its call site was not.
Fixed by driving the whole pipeline: `renderPoseWith('dressed', SHAPES, { backdrop: 0x000000 })`
must throw. **Testing a guard is not the same as testing that it is invoked.**

⚠️ One test in this file was itself WRONG on first write: it asserted the guard
refuses `0x676467`, "the gi's grey". That is the gi's grey **in the source
video**, not in our traced art, so it did not throw. Replaced by a set derived
from the plan itself, which cannot be wrong that way and grows with the outfit.

### Regression
```
suite   47 files / 810 tests green   (44 / 750 at session start, 46 / 795 at eff0c2f)
tsc x2 exit 0 · eslint exit 0 · CLI output unchanged: digest e9ddfe43b6ea139b
```

## SESSION 20 — A6.2: the comparator. **GATE A6-B MET.** Baseline committed BEFORE any tuning.

`scripts/art/compareToSource.py` — our headless render vs a source frame, scored
whole AND attributed per slot. Build-time only; reads gitignored `reference/`.
⭐ **Committed in its own commit, before A6.3/A6.4 change anything**, so the
baseline cannot be fitted to a result (SESSION 19's `00c6628` discipline).

### ⭐ THE FRAME SIDE IS VERIFIED IDENTICAL TO A5.5 — the ceiling reproduces EXACTLY
```
frame zFt_0061 vs frame zFt_0071 : 0.8808   <- kickoff §P8 committed 0.8808
```
So the segmentation and the agreement statistic are A5.5's, to four decimals.

### ⛔ AND THAT PINS A REAL DISCREPANCY ON *OUR* SIDE — A6-D's TARGET IS NOT COMPARABLE
```
                              A5.5 (committed)   A6.2 (this pipeline)
  vs the TRACING frame 0061        0.8742              0.8659
  vs the HELD-OUT frame 0071       0.8294              0.8100
  frame vs frame (the ceiling)     0.8808              0.8808   <- identical
```
The frame side matches exactly and our side does not, so the difference is
entirely in what "our render" IS: **A5.5 measured a browser JPEG screenshot at an
unknown scale over a hand-injected backdrop; A6.2 measures an exact PNG.** The
JPEG's blur dilates our silhouette toward the source, which flattered the score.
⇒ **The kickoff's A6-D bar of "> 0.8294" was produced by a different pipeline and
cannot be compared to this one.** The honest baseline, committed here before any
tuning: **tracing 0.8659, held-out 0.8100.** A6-D is re-expressed against those.
⚠️ Not a softening — the new numbers are LOWER. The old ones were optimistic.

### ⛔ THE FINDING THAT WOULD HAVE WRECKED A6.4: THE ABSOLUTE X OFFSET IS THE ANCHOR, NOT A MEASUREMENT
Registration uses the ground line (vertical) and the figure's height (scale) —
both reliable. The THIRD axis has no landmark, because the source fighter wears
different head art and stands in a different pose. Re-running with four different
x-anchors:
```
  x-anchor              kasa17    gi15  hakama7        kasa-minus-hakama
  centroid (shipped)    +7.57   +3.54    -6.83              14.40
  feet band 90-100%    +11.89   +7.86    -2.51              14.40
  pelvis band 55-70%    +6.24   +2.21    -8.17              14.41
  bbox centre           +7.45   +3.42    -6.95              14.40
  spread of the absolute offsets: 20.06 world px
```
**Every absolute offset moves; every DIFFERENCE is constant.** A whole-figure
translation cancels in a difference, and the x-anchor is exactly that.
⇒ The comparator now reports `relOffsetErr` (offset against the median slot).
**Measured spread across all four anchors: 0.0000 world px** for `relOffsetErr`
AND for `sizeErr`, against 20.06 for the raw offset.
⇒ **A6.4's loop may tune `relOffsetErr` and `sizeErr` ONLY.** Chasing the
absolute offset would fit the anchor choice and call it progress.

### GATE A6-B ✅ — every dressed slot, signed, in WORLD px (vs zFt_0061)
```
    slot shapes        rows  edge   leftErr  rightErr   sizeErr   relOffset
       7 9011  hakama    65    20     -7.15     -6.52     +0.63    -10.38
      15 9015  gi        51    35     +4.30     +2.79     -1.51     +0.00
      17 9017  kasa      27     7     +8.89     +6.25     -2.65     +4.03
       9 2674  foot      11     5       -      +17.28       -         -
       2 2658  lowarm    21    13    +11.35       -         -         -
   1,13,14,18  interior — a silhouette cannot grade them, and it says so
```
⚠️ **`sizeErr` vs `relOffsetErr` answer different questions on purpose.** Both
edges pushed the same way is the garment in the wrong PLACE (D1 lets the loop fix
that); edges pushed apart is the wrong SIZE (D1 does not).
⚠️ Slots whose art never reaches the outer boundary are reported `interior`
rather than given a number. A silhouette cannot see the obi or the collar.

### ⭐ THE OVERLAY, AND WHAT OPENING THE SOURCE FRAME SETTLED
Every run writes `renders/overlay.png` — theirs RED, ours CYAN, agreement WHITE.
IoU 0.7160. Opening the frame at 3× (`renders/source_frame_crop.png`) settled
three things a number could not:
1. ⛔ **The big red spike on the left is the SWORD HILT**, with the scabbard tip
   below right. We render no weapon — slots 3 and 4 are EMPTY BY DESIGN, the
   game's own "none" placeholders, and that equipment art died with the CDN.
   ⇒ **Our achievable ceiling is BELOW 0.8808**, because both source frames carry
   a sword our fighter cannot. A6-D must be read against that, not against a
   ceiling measured between two armed fighters.
2. **The source's FEET ARE HIDDEN IN GRASS** — it has no visible feet at all,
   while ours protrude below the hem (the cyan at the bottom). So §P7 defect 3 is
   worse than "the feet sit below the hem": the source shows no feet there.
   ⚠️ It also means the "ground line" registers our feet against the source's
   grass-occluded hem, which is a stated limit of the vertical axis.
3. ⭐ **The source has a WHITE COLLAR between the kasa and the grey jacket**, and
   its grey gi starts well below the head. Ours runs grey straight up under the
   hat. **§P7 defect 1 is now confirmed against the source**, not by eye alone.

### Regression
```
suite 47 files / 810 tests green · tsc x2 -> 0 · eslint -> 0
nothing in src/ changed; the comparator is build-time only and reads reference/
```

## SESSION 20 — A6.3: the score becomes a gate. **GATE A6-C MET.**

`tests/a6Score.test.ts` — the dressed fighter's agreement with the source is a
committed number the suite holds as a FLOOR. **From here, a change that makes the
fighter less like the source turns the suite red.** That is the thing SESSION 19
did not have, and the reason four defects shipped past a 750-green suite.

### ⛔ A6-C AS LITERALLY WORDED IS NOT ACHIEVABLE, AND HERE IS WHAT REPLACED IT
The kickoff says "the suite enforces it as a FLOOR". **The suite cannot run the
comparator**: `reference/` is gitignored, a clean clone has no frames, and a
runtime read of it is the bug SESSION16 finding 4 cost this repo a broken
checkout for. So the source side is committed as DERIVED DATA — nineteen
measurements per frame in `scripts/art/sourceProfile.ts`, the same kind of
committed target the A5-C set already is — and our side is computed in-suite from
the renderer's own exact coverage mask (`scripts/art/silhouette.ts`).

⚠️ **THERE ARE NOW TWO SCORES AND THEY ARE NOT THE SAME NUMBER.** Say which.
```
  SEALED     (tests/a6Score.test.ts)  ours = exact coverage mask, source = committed numbers
                                       portable, runs in CI, gates the suite
  DIAGNOSTIC (compareToSource.py)      both sides through proportions.py's image segmentation
                                       richer (per slot + an overlay) but needs reference/
```
They differ by construction — a heuristic segmentation of a rendered PNG is not
the same pixel set as the renderer's own coverage. Neither is wrong; quoting one
as the other would be.
```
                    SEALED          DIAGNOSTIC
  tracing 0061      0.8597            0.8659
  held-out 0071     0.8197            0.8100
```

### THE COMMITTED FLOORS, and what they are worth
```
  FLOOR_TRACING  0.8597    exact at commit 0.8597286207791531
  FLOOR_HELDOUT  0.8197    exact at commit 0.8197393639422795
  ceiling (the source's own two frames, against each other)   0.8808
```
Floors are the measured values **TRUNCATED, not rounded**, so the gate cannot
fail on digits it does not state.
⭐ **For scale — the BARE fighter scores 0.6993 / 0.7479 against the same frames.**
Clothing it is worth **+0.16** on the traced frame. That is the evidence SESSION
19's entire outfit rests on, and until now nothing in the repo stated it.
⛔ **The floors may only ever move UP, in a commit that says why.** Lowering one
is the most damaging edit available here: it turns the only source-fidelity
measurement in the repo into a rubber stamp.

### CHAOS-PLANTED EXACTLY AS §4 A6.3 ASKS — one garment, 5 world px
```
plant: every x coordinate of the kasa (shape 9017) shifted +5 world px
  -> tests/a6Score.test.ts   × holds its FLOOR against the HELD-OUT frame
  -> tests/poseRender.test.ts × GOLDEN pixels · × ink box · × crop
  4 failed | 21 passed        shape9017.ts then restored BYTE-IDENTICAL
```
⭐ **The HELD-OUT frame is what caught it, not the traced one** — which is
precisely why a frame was held out. A 5 px nudge can flatter the frame the outfit
was fitted to while making the fighter worse in general.

### The gate also pins the MEASUREMENT, not just the score
A floor is only as good as the statistic under it, so the same file asserts:
the profile is sampled at exactly the 19 heights the source numbers were measured
at · a profile scores 1.000 against itself · mismatched lengths THROW rather than
zipping to the shorter · a limb present on one side only scores 0 for that sample
· the committed source numbers are plausible silhouettes (200–280 px tall, no
width above 0.6× height) · and **the dressed fighter must out-score the bare one**,
without which SESSION 19 would be unevidenced.

### ⚠️ WHAT A GREEN A6-C STILL DOES NOT MEAN (kickoff §6 Risk 1)
A silhouette score is blind to **colour, to paint order, and to a garment on the
wrong slot** — SESSION 19's sleeve-on-the-torso would score FINE here. The pixel
gate in `tests/poseRender.test.ts` catches a changed render; a human looking at
`renders/overlay.png` catches the rest. **Necessary, not sufficient**, and the
file says so at the top.

### Regression
```
suite 48 files / 820 tests green   (44 / 750 at session start)
tsc x2 -> 0 · eslint -> 0 · nothing in src/ changed
```

## SESSION 20 — A6.5 (gi): **THE LOOP OVERTURNED ITS OWN BAR.** Scores ratcheted up.

⭐ **THIS IS THE SESSION'S THESIS LANDING ON THE SESSION'S OWN PLAN.** The kickoff
prescribed a fix. The fix was measured. **The measurement said the prescription
was wrong**, and named the real defect instead. Nothing but a gate could have
produced that outcome.

### ⛔ WHAT §P7 / A6-E PRESCRIBED, AND WHY IT IS WRONG
> "THE GI IS 1.76× OVERSIZED… Fix: slot 15 wears a TORSO-SIZED panel; the sleeve
> carries the rest." · **A6-E: slot 15 ≤ 1.25× the torso, top BELOW y 325.3**

**Implemented and measured. It makes the fighter WORSE on every axis:**
```
                              sealed tracing   sealed held-out   diagnostic IoU
  baseline (A6.3)                 0.8597           0.8197            0.7160
  carve the sleeve out of 15      0.8010           0.7963            0.6617   <- WORSE
```
Carving the sleeve's own region back out does not leave a body panel — it leaves
a narrow front **STRIP**, and the rendered torso comes out nearly bare. Looked at,
not just scored. **The outer silhouette on slot 15 is correct and deliberate**:
the near sleeve hides the body, so slot 15 wears the whole outline and slot 19
draws over it. The 1.76× is that design, not a defect.

### ⛔ AND A6-E's SECOND CLAUSE IS UNSATISFIABLE — MEASURED, NOT ARGUED
"its top is BELOW the head's bottom (y 325.3)". **The BARE torso it replaces
already violates that**:
```
  slot 15, shape 2646 (bare torso)   496.6..522.4 x 321.4..352.1   25.8 x 30.7
  slot 16, head+hair                 501.5..519.8 x 303.2..325.3
  -> the torso's OWN top (321.4) sits 3.9 px ABOVE the head's bottom (325.3)
```
No garment covering the torso can satisfy it. §P7 compared the gi's top to the
chin **without checking where the torso's top was**. In a side view the shoulder
line overlaps the jaw; that is anatomy, not a bug.
⇒ **The honest bar is "slot 15's top is at or below the top of the part it
replaces" (321.4). Ours is 322.5 — it passes that.** Recorded for an owner
ruling; the gate was NOT quietly rewritten to fit.

### ⭐ THE REAL DEFECT WAS THE ANCHOR, AND IT IS A ONE-WORD FIX
`traceGarment.py` already encodes the right rule for the SLEEVE — *"the sleeve
hangs FROM the shoulder, so its TOP anchors to the upper arm's top, not its
centre — centring would ride it down the forearm."* **The gi body has exactly the
same geometry and was `anchor="centre"` anyway.** The jacket runs shoulder-to-hip,
so it is TALLER than the torso part it replaces, and centring a taller shape on a
shorter one pushes half the excess **upward — into the head.**
```
  anchor="centre"   slot 15   489.4..530.4 x 311.9..362.3    top 13.4 px inside the head
  anchor="top"      slot 15   489.6..530.6 x 322.5..372.9    top 2.8 px above the chin,
                                                             1.1 px BELOW the bare torso's own top
```
**Placement only — kickoff D1 permits it, and no traced vertex moved.**

### THE SCORES, RATCHETED UP
```
                        sealed tracing   sealed held-out
  A6.3 as committed         0.8597           0.8197
  A6.5 gi anchor            0.8834           0.8472     <- floors now here
  the BARE fighter          0.6993           0.7479
  frame-to-frame ceiling            0.8808
```
⚠️ **The tracing score (0.8834) now sits just ABOVE the 0.8808 frame-to-frame
ceiling, and that is worth watching, not celebrating.** The held-out score
(0.8472) is the honest one: it improved by **+0.0275** against a frame the outfit
was never traced from, and the two stay 0.0362 apart — no sign of overfitting.
⭐ **Our achievable ceiling is BELOW 0.8808 anyway**: both source frames carry a
SWORD we render no art for (slots 3/4 empty by design).

### What the loop cost, and what it bought
Two hypotheses tested against the source in one step, one kept, one rejected —
and the rejected one is the one the kickoff asked for. **A6.4's loop is running;
this is its first two iterations, recorded with their numbers.**
⚠️ Still open and visible in `renders/dressed.png`: the feet hang below the
hakama hem (the source's feet are hidden in GRASS entirely), and the 11 % height
overshoot, which §P7 already suspects is the SKELETON and no placement can fix.

### Regression
```
suite 48 files / 820 tests green · tsc x2 -> 0 · eslint -> 0
GOLDEN_DRESSED digest e9ddfe43… -> 17f38537…  (a DELIBERATE render change)
```

## SESSION 20 — A6.4: the loop RAN. **One winner of twelve — and it found a hole in its own score.**

`scripts/art/tuneAnchors.py` + `scripts/art/scorePose.ts` — retrace → regenerate
→ render → score, over placement variants, ranked and guarded. **D1 held: every
knob is an anchor; not one traced vertex moved.**

### THE DEFINITIVE SWEEP — 12 variants, from the committed baseline
```
variant                 tracing  HELDOUT      gap  height   verdict
baseline (committed)     0.8835   0.8472   0.0362   140.5   —
kasa brim 0.50           0.8806   0.8556   0.0250   142.6   REJECT grew +2.1 px
kasa brim 0.55           0.8842   0.8533   0.0309   141.6   REJECT grew +1.1 px
kasa brim 0.65           0.9029   0.8375   0.0654   139.4   reject OVERFIT traced +0.0194
kasa brim 0.70           0.8982   0.8247   0.0735   138.3   reject OVERFIT traced +0.0147
hakama +3                0.8857   0.8477   0.0380   140.5   better +0.0005
hakama +6                0.9006   0.8619   0.0387   140.5   ✅ TAKEN  +0.0146
hakama -3                0.8481   0.8098   0.0382   140.5   reject -0.0374
hakama -6                0.8150   0.7767   0.0382   140.5   reject -0.0705
collar top-anchored      0.8855   0.8453   0.0402   140.5   reject -0.0019
obi top-anchored         0.8835   0.8472   0.0362   140.5   reject +0.0000 (interior — invisible)
gi back to centre        0.8597   0.8197   0.0400   140.5   reject -0.0275 (confirms A6.5)
```
⭐ **"gi back to centre" reproduces A6.3's exact pre-fix numbers**, which is a
clean independent confirmation that the A6.5 anchor fix is worth +0.0275 held-out.

### ⛔ THE LOOP FOUND A HOLE IN ITS OWN SCORING FUNCTION — THE BIGGEST FINDING OF A6.4
The profile agreement is width/height at 19 heights: **SCALE-FREE by design**, so
two figures at different sizes compare directly. That also means **a taller
fighter costs it nothing**, and the sweep walked straight through it:
```
  hakama +15   held-out 0.8472 -> 0.8781 (+0.0309, the best of the whole run)
               gap 0.0362 -> 0.0067      (which normally reads "not overfitted")
               height 140.5 -> 148.2 stage px = 263.4 -> 277.9 video px
               i.e. 11.3 % too tall -> 17.4 % too tall
```
**The render showed trousers slid down the thighs, bare skin at the hips, and the
feet swallowed by the hem.** Every number said yes; the picture said no. This is
kickoff §6 Risk 1 arriving exactly as written, and the only thing that caught it
was the rule that a human looks before a gate is believed.
⇒ **Two guards added, both bought with a wrong answer:**
1. **Rank on the HELD-OUT frame, never the mean.** Ranking on the mean first
   crowned "hakama +6" for taking the TRACED frame to 0.9164 while making the
   held-out frame WORSE. A mean will happily buy an overfit.
2. **Reject any variant that makes the figure taller** — in the loop AND in the
   suite (`GATE A6-C companion`, chaos-proven: the +15 art turns it red).
⚠️ A scale-free score needs a scale gate beside it, or the loop is free to buy
proportion with size. §P7 defect 2 was invisible to A6-C alone.

### ⛔ AND A BUG IN THE LOOP ITSELF, CAUGHT BY TWO IDENTICAL NUMBERS
The first sweep regenerated only the shape ids each variant touched, so every
variant inherited the PREVIOUS one's committed art and each row measured
cumulative state. **It was caught because the collar and obi variants returned
byte-identical scores — which two different changes cannot.** Every row after the
first hakama probe was contaminated; the fix (regenerate all seven, ~2 s) changed
hakama +6's held-out from a fictional 0.8416 to a real 0.8619.

### WHAT WAS TAKEN, AND ITS HONEST LABEL
`HAKAMA_FIT = 6.0` world px. The node data says where the HIP is; it does not say
where the WAISTBAND is. **FITTED by the loop, not derived** — and labelled so, in
a file whose neighbouring term IS derived from the OG's own nodes.
⭐ **Looked at before accepting**: the hakama now sits properly, no bare skin at
the hips, and **the feet emerge from under the hem instead of floating detached
below it** — §P7 defect 3, visibly improved as a side effect.

### Scores after A6.4
```
                    tracing   held-out    gap    height
  A6.3 committed     0.8597    0.8197   0.0400   140.5
  A6.5 gi anchor     0.8835    0.8472   0.0362   140.5
  A6.4 hakama fit    0.9006    0.8619   0.0387   140.5   <- floors now here
  bare fighter       0.6993    0.7479      —     128.2
  frame-to-frame ceiling      0.8808
```
⚠️ **The tracing score now sits ABOVE the 0.8808 ceiling and that is watched, not
celebrated.** The held-out score is the honest grade: **+0.0422 across the
session**, on a frame the outfit was never traced from.

### Regression
```
suite 48 files / 822 tests green   (44 / 750 at session start)
tsc x2 -> 0 · eslint -> 0 · D1 intact: no traced vertex moved, only anchors
```

---

## SESSION 21 — A8.1: THE COLOUR RULER, AND THE STARTING WEAPON IS A BRANCH

### GATE A8-A MET — a committed per-garment colour comparison, from masks not pixels
`scripts/art/colourRuler.py` measures, for each of the seven traced garments, the
**source frame's own median colour inside that garment's own traced mask**, and
compares it to **the fill we committed**. `scripts/art/sourceColour.ts` holds the
seven medians as committed derived data (the `sourceProfile.ts` pattern), so
`tests/a8Colour.test.ts` grades in a clean clone with no `reference/`.

⭐ **IT SHARES ITS MASKS WITH THE TRACER.** `traceGarment.garment_masks` was
extracted out of `trace_one` so that the ruler and the thing it measures cannot
disagree about which pixels are the hakama — the drift `src/core/ringGeometry.ts`
exists to prevent. **Proof the extraction changed nothing: all seven traced
shapes regenerate BYTE-IDENTICAL** (`git diff src/game/art/generated/` empty).

### THE MEASUREMENT — committed BEFORE any colour was touched (the A6.2 discipline)
```
   id garment              SOURCE median   OURS (committed)   delta r,g,b  worst  spread
 9017 kasa straw           (122, 88, 38)   (142,111, 56)      +20 +23 +18    23 ⛔ 38,35,24
 9012 collar / juban       (204,201,203)   (182,180,182)      -22 -21 -21    22 ⛔ 16,17,14
 9011 hakama               (220,213,219)   (200,195,197)      -20 -18 -22    22 ⛔  3, 2, 5
 9015 gi body              (104,100,103)   (110,107,109)       +6  +7  +6     7     2, 1, 1
 9019 gi sleeve near       (104,100,103)   (106,102,105)       +2  +2  +2     2     2, 1, 1
 9014 obi                  (204,201,201)   (205,202,203)       +1  +1  +2     2     6, 6, 8
 9001 gi sleeve far        (103,100,103)   (102, 99,103)       -1  -1  +0     1     2, 2, 2
```

### ⛔ THE KICKOFF'S §P4.12 IS HALF RIGHT, AND THE HALF THAT IS WRONG HAS THE SIGN BACKWARDS
- **hakama — CONFIRMED.** §P4.12's hand-picked `(220,213,219)` is exactly the
  mask median. Ours is **~20 DARK**, as it said.
- **gi — CONFIRMED "fine."** Worst channel 7, 2 and 1 across the three gi parts.
- ⛔ **kasa — REFUTED, but NOT for the reason first written here.**
  §P4.12 read the straw as `(167,126,61)` and called ours 25 too DARK. From the
  kasa's own mask the median is **`(122,88,38)`** and ours is **+23 too LIGHT** —
  so the SIGN IS BACKWARDS either way, and that much stands.
  ⚠️ **THIS STEP'S OWN FIRST ANSWER WAS WRONG AND WAS OVERTURNED BY CHECKING IT.**
  It said `(167,126,61)` was "a third hand-picked sample landing on the wrong
  garment". **It is not off-garment at all.** Measured on the kasa's own mask:
  ```
  p25 (116, 84, 33)   p50 (122, 88, 38)   p75 (154,119, 57)   p90 (173,138, 74)
  §P4.12's (167,126,61): 11.32 % of the kasa's own mask pixels are within 12/channel
  our committed (142,111,56):  14.32 %
  ```
  `(167,126,61)` sits at roughly **p85 of the straw's own distribution** — a real
  straw pixel, just a BRIGHT one. ⇒ **The kasa is genuinely two-tone** (a ~57
  level split in R between its dark band and its lit face), which is what an
  `iqr` of **38,35,24** was already saying.
  ⇒ **THE REAL LESSON IS SHARPER THAN "the sample missed":** a hand-picked pixel
  cannot summarise a two-tone garment — **and neither can a median.** Our
  committed `(142,111,56)` sits BETWEEN the two modes, which for a flat fill is
  arguably the least-wrong single value available.
  ⛔ **SO A8.4 MUST NOT DARKEN THE KASA TO MEET A8-D.** That would move it onto
  the dark mode, make the hat visibly darker than the source reads, and score
  better doing it — the exact "a green gate is not a good picture" trap SESSION
  20 paid for twice. **The kasa's defect is missing straw texture (§P4.9, A8.6),
  not hue.**
  ⇒ **D4 still paid** — it is what produced the distribution that overturned
  both readings — but the two samples the kickoff excluded were excluded on its
  own evidence and are NOT re-litigated here.
- ⭐ **collar — NEWLY MEASURED.** §P4.12 excluded its own collar sample. The
  juban is **`(204,201,203)` — near-white** — and ours is **22 DARK**. So §P4.10
  ("the collar does not read") is not only a size problem; it is also a colour
  one, and now it has a number.

### ⭐ THE CAUSE IS THE SAMPLING RECIPE, AND IT IS PROVEN, NOT SUSPECTED
The ruler prints `trace_one`'s own recipe (5x5 median filter → mean over a
once-eroded core) beside the true median. **The recipe reproduces our committed
fill EXACTLY for all seven garments** — so the whole error is in the recipe.
⚠️ **But it is not a global darkening**, and §P4.12's "our fills are dark" framing
is wrong: the kasa goes **+20 lighter**, the hakama and collar **~20 darker**.
Every garment is dragged **toward whatever surrounds it** — the kasa toward the
bright background, the white garments toward their heavy black outline. That is a
boundary-bleed signature, not a gamma one.
⚠️ **HONEST LIMIT:** the recipe differs from the ruler in TWO ways at once — the
filter+mean, and the erosion depth (1 step vs up to 6). A8.4 must separate them
before claiming which one does it.

### ⚠️ WHAT THIS GATE CANNOT SEE, STATED SO IT IS NOT OVER-READ
It grades ONE flat fill against ONE median. `iqr` is committed beside each median
because it is the honest caveat: the kasa's spread is **38,35,24** — it is not
one colour in the source at all, so matching its median will NOT make it look
right. Its real defect is missing straw texture (§P4.9). The hakama's spread is
**3,2,5**, so for that garment the median IS the whole answer.

### ⚠️ AND THE INK, MEASURED BUT DELIBERATELY NOT GATED
The source's outline is **not black**: medians of `#180e06` (kasa), `#140e0e`
(collar), `#0e0b0c` (near sleeve), `#0d080c` (obi) — very dark warm greys, and we
paint `0x000000`. Reported, never gated: an anti-aliased edge has no single true
colour, and the gi's `#3f3729` and the hakama's `#242e15` are visibly
contaminated by the grass and scenery behind them.

### ⛔ THE STARTING WEAPON IS A BRANCH, NOT A SWORD — OWNER, AND CONFIRMED ON THE FRAME
The owner said the starting weapon is a stick. **It is, and the kickoff's A8.2
("trace the saya + tsuka onto slots 3/4") is built on a wrong premise.** Read
directly off the PLAYER screen of video A (`zFtCaTO0_1M`):
```
t = 708.0 s   BRANCH   DMG: 1 - 2  (EQ: 1 - 3)   WEIGHT: 1   LEVEL 1
t = 656.0 s   PICKAXE  DMG: 1 - 3  (EQ: 1 - 2)   CONDITION: WELL-MAINTAINED
```
⭐ **AND THE PAIR SETTLES A FLAGGED AMBIGUITY.** `A-04-mines-takahasi…md` recorded
the `EQ:` qualifier as "unclear from visuals alone — flag as INFERRED". The two
readings are mutually consistent under exactly one rule: **`EQ` is the currently
EQUIPPED weapon's damage range, shown for comparison**, and the selected item's
number is coloured **green when better than equipped, red when worse** (the `3`
is green on the pickaxe, the `2` is red on the branch). Under any "bonus range"
reading the two frames contradict each other.
⇒ **Starting weapon: BRANCH, DMG 1–2, WEIGHT 1, LEVEL 1.** The item icon is a
gnarled brown branch with a small green leaf; the paperdoll wears it exactly as
the tracing frame shows — **one straight brown rod tucked through the obi**, no
tsuba, no wrap, no scabbard.
⇒ **`reject_occluder`'s docstring calls it "THE SAYA / the sheathed sword" and
that name is wrong** — the mechanism (a warm-brown occluder crossing the far leg)
is right and unchanged. **A8.2 traces ONE stick onto slot 3, not a saya + tsuka
onto 3 and 4.**

### Regression
```
suite 49 files / 827 tests green   (48 / 822 at A8.0)   tsc x2 -> 0 · eslint -> 0
3 chaos plants, all watched RED then reverted:
  fill shifted +20 past its ratchet          -> ratchet test red
  a second, different interior fill on 9019  -> "ONE colour" + ratchet red
  a garment dropped from sourceColour.ts     -> coverage-both-directions red
⚠️ A 4th plant first reported GREEN and it was the HARNESS, not the gate: BSD
`sed -i '' '0,/pat/s//repl/'` silently did nothing. **Check the plant landed
(`git diff`) before believing a green** — SESSION18 A4.1 paid for this once too.
D1 intact: no traced vertex moved. No colour changed — measurement only.
```

---

## SESSION 21 — A8.2: THE ATLAS, AND THE BRANCH THAT WAS IN THE REPO ALL ALONG

### ⛔ THE PREMISE THREE SESSIONS BUILT ON WAS NEVER CHECKED
`ogPose.ts` records slots 3/4/17 as "the game's own 'none' placeholders; **equipment
art died with the CDN**", and SESSION 21's kickoff planned A8.2 as *"trace the saya
+ tsuka onto slots 3/4"* — i.e. reconstruct a weapon from a 233-px-tall,
JPEG-compressed video figure. **Nobody had ever rendered the 1822 shapes sitting in
`reference/extracted/shapes/`.** Only the 16 the fighter uses had ever been looked at.

⭐ **NEW TOOL: `scripts/art/shapeAtlas.ts`** renders every extracted shape through
the repo's OWN pipeline (`convertShapeSvg` → `planShape` → `rasterise`) into contact
sheets, so a shape that looks right in the atlas is a shape the game can draw.
```
1335 shapes over 10 sheets   483 unconvertible, 4 rendered empty (counted, not hidden)
```

### ⭐ THE STARTING WEAPON IS `DefineShape 2641`, AND IT IS ORIGINAL VECTOR ART
Sheet 06 carries a **knobbly brown tree branch with a green leaf** — pixel-for-pixel
the item icon on the PLAYER screen at t=708.0 s. **It is not a rod, not a sword, not
a saya: it is the training branch**, the weapon a new character starts with
(`BRANCH · DMG 1-2 · WEIGHT 1 · LEVEL 1`).
⚠️ **THE REPO ALREADY HELD IT AND DELIBERATELY SKIPPED IT.** SESSION 18 recorded
*"`2641` (training branch) and `2662` (alt head) are deliberately NOT committed —
neither is in the fighter."* True of the BARE idle doll; wrong for the dressed one.
⇒ **A8.2 does not trace anything. It commits 2641.** Tracing a blurry raster of art
we already hold exactly is not a 1:1 recreation, it is a worse copy.

### ⭐ WHY THE BRANCH SURVIVED WHEN THE KASA AND GI DID NOT — settled by LOOKING
All ten sheets were read. The payload contains: the fighter's body parts, **the
branch**, a fully detailed alt head (2662), items, VFX, scenery, buildings, clan
crests, UI chrome, and the **equipment-SLOT ICONS** (sheet 03's bottom row is the
grey placeholder set — kasa, oni mask, body armour, gloves, greaves, katana, boots,
ring — exactly the empty-slot outlines on the PLAYER screen).
**No wearable kasa, gi or hakama appears anywhere in 1822 shapes.**
⇒ The split is not arbitrary: equipment art is fetched **by name at runtime** and
that CDN is dead, but the STARTING weapon is what a brand-new character already
holds, so it ships in the payload. **Tracing the garments from video remains correct;
tracing the weapon never was.**

### ⛔ HOW THE ORIGINAL ART WAS ACTUALLY MADE — AND WHY OURS IS NOT 1:1
Measured across the 14 OG fighter shapes against our 7 traced garments:
```
                    OG's own art (2644-2678)        our traced garments (9001-9019)
  fills per part    2 - a base tone + a HARD-EDGED   1 flat tone
                    shadow shape
  outline           a real STROKE, width 2 / 1.5 / 1 a black FILLED BLOB of whatever
                                                     thickness the video thresholded
  detail            thin strokes, width 0.5-1        none
  palette           2 skin tones reused globally     one video sample per garment
                    (#feca98, #b78f6c) + #9e9a97 /
                    #dcd9d4 cloth
  contour           smooth Bezier                    potraced raster, ragged
```
⇒ **The gap is STRUCTURAL, not a colour tweak.** The OG is cel-shaded Flash vector
art: flat fills, a hard shadow shape, a stroked contour, thin interior detail lines,
paint order significant. Ours is *a silhouette with a hole punched in it*. **No
amount of colour tuning in A8.4 can close this** — the garments have to be
re-authored in the OG's grammar, using the video as the outline guide the way a
Flash artist would use a reference.
⭐ **AND THE OG'S OWN CLOTH COLOURS ARE BYTE-EXACT, NOT SAMPLED.** Shape 2653
(pelvic) carries `#dcd9d4` and `#9e9a97` straight from the SWF. Our video-measured
hakama median is `(220,213,219)`; `#dcd9d4` is `(220,217,212)` — **within 7 levels
on every channel.** The lossy sample is confirming the exact value we already hold.

### ⛔ THE BULGE IN THE SHIRT — DIAGNOSED (owner, 2026-07-28)
The owner: *"there is a bulge in the character's shirt."* There is, and it is
**shape 9015's own traced outline**, not a placement or a layering error.
- Rendering the pose with slot 19 (near sleeve) emptied leaves the ink bounds
  **byte-identical**, so the doubled-sleeve theory carried since SESSION 19 §P7 is
  **refuted** — the sleeve is entirely inside the silhouette and contributes nothing
  to the outer boundary.
- Rendered alone (`renders/garments_alone.png`), 9015 has a large rounded lobe
  jutting off its back edge with a waist below it. `outer_silhouette` flood-fills
  *(garment-grey OR ink)* from a seed, and the fill **leaks across the jacket's back
  edge into the far-sleeve/back region**, merging them into one balloon. The source's
  back is a single smooth curve from shoulder to hip.
⇒ **It is a trace defect of the same family as the ragged hem (§P4.6).** Both are
fixed by re-authoring, not by nudging an anchor.

### ⚠️ WIRING THE BRANCH COSTS THE SEALED FLOOR — A8-E BINDS, AND THE FLOOR STAYS UP
Wired at slot 3 the branch renders (21 parts, 70 draw ops) and is placed by the OG's
OWN node — node 3 is real data, `{ x: 12, y: -61, rotationDeg: 142 }`.
```
                    held-out agreement      tracing frame     height
  without branch          0.8619               0.9185          140.5   <- committed floor
  with branch             0.8526               (floor held)    140.5
```
⛔ **The floor was NOT lowered.** The kickoff wrote the response in advance
(§2 A8-E): *"if it costs agreement, say so, show both numbers, and ask."*
⚠️ **AND THE DROP IS PROBABLY OUR FAULT, NOT THE BRANCH'S.** The source's stick runs
**upper-left → lower-right**; ours runs **upper-right → lower-left** — mirrored.
⭐ **The lead:** node 3's `rotationDeg` is **142**, and the source needs about
**+38**. `142 = 180 - 38`, which is a horizontal-mirror signature, and node 4 (prop)
carries exactly `-38`. The weapon slot's art is very likely authored for the
opposite facing. **Resolve that before ruling on the trade** — a correctly angled
branch may well score ABOVE the floor rather than below it.
⇒ **Committed state: `shape2641.ts` lands, slot 3 stays UNWIRED, suite green at 827.**

### ⚠️ WHAT A KASA IS, SINCE THE ART DEPENDS ON IT
A **kasa** (笠) is a traditional Japanese conical hat **woven** from straw, sedge,
rush or split bamboo. The wide rōnin/pilgrim form here is a *sugegasa*-type. The
word matters to the art: because it is WOVEN, the original shows **radial ribs
fanning from the apex** (the weave's spokes) and **a fringe of cut straw ends
ticking down all round the rim**. Ours is a flat solid cone with neither, which is
why it reads as a plastic triangle rather than straw — §P4.9, and A8-A cannot see it
(its `iqr` of 38,35,24 is the same fact stated as a number).

### Regression
```
suite 49 files / 827 tests green   tsc x2 -> 0 · eslint -> 0
shape2641.ts committed and byte-for-byte re-derivable; slot 3 unwired, so the
render and every committed digest are UNCHANGED by this step.
```

## SESSION 22 — A9.1: THE PAINT-GRAMMAR GATE. The structural gap becomes measurable.

**Steps A9.1a (`f7e3801`) + A9.1b (this commit).** Baseline `d77176a` — two
doc-only commits above the kickoff's stated `20310b9`; `git diff 20310b9..HEAD
-- src tests` was EMPTY at session start (only `scripts/art/inkShare.ts` and
docs landed between).

### What shipped
```
scripts/art/colourRuler.py    --emit now writes p25/p75 per garment (A9.1a)
scripts/art/sourceColour.ts   +22 lines, pure additions; medians/iqr untouched
scripts/art/grammar.ts        the paint-grammar ruler: grammarOf + violationsOf
scripts/art/inkShareLib.ts    inkShareOf extracted VERBATIM from the CLI
scripts/art/inkShare.ts       now the CLI shell + the shape roster; output byte-identical
tests/a9Grammar.test.ts       GATES A9-A/B/C/D — 20 tests
```

### The gate's mechanics — a ratchet with named exemptions
- **Partition:** every traced id is in `REAUTHORED` (grammar enforced) or in
  `LEGACY` (pinned exactly: no strokes, 1 ink fill ring, the one tone). A shape
  moves legacy → roster in the commit that re-authors it, never back.
- **Positive control, measured not asserted:** 13 of the 15 committed OG shapes
  (incl. the branch 2641) outline with an ink stroke, widths ⊆ {0.5, 1, 1.5, 2};
  the two that do not are pinned by name — 2670 hair (solid mass IS the design)
  and 2672 foottop (the one OG part outlined by filled rings). 2653 pins the SWF
  cloth pair `#9e9a97`/`#dcd9d4` — kickoff D4's source.
- **"Ink" has ONE definition:** all channels < 40 (`INK_CHANNEL`, A8.3's own
  BLACK threshold) — admits the OG's near-black outline colours (#180e06 …),
  shared by the pixel ruler and the paint ruler so the two cannot drift apart.
- **A9-D:** darkest tone vs p25 (shadow), lightest vs p75 (base), each within
  12 levels/channel; middle tones are detail accents, deliberately ungraded
  (the OG's own 2650 carries three fills; its middle has no measurable target).
- **A9-B:** the bar is computed LIVE from the committed OG art (worst non-hair
  share, = 2674 at 61.4%), and the suite pins that derivation to guard the lib
  extraction.

### RED PROOF — the gate fails today's seven, by name
Temporarily rostering all seven produced (9001 shown; the profile is uniform):
```
+ "A9-A: no ink stroke — the contour must be a stroked outline, not a filled ring",
+ "A9-A: 1 all-ink fill ring(s) — the traced blob outline must go",
+ "A9-C: 1 tone(s) — the OG paints a base + one hard-edged shadow",
+ "A9-B: ink share 70.6% over the OG's own worst 61.4%",
```

### Chaos plants — 3, each watched RED then reverted
1. `shape2646` stroke width 2 → 2.7 → `every OG ink-stroke width sits inside the bar` RED.
2. `shape9012` tone `0xb6b4b6` → `0xb0b0b0` → `every legacy shape matches its pin exactly` RED.
3. 9012's pin deleted → `REAUTHORED and LEGACY together are exactly the traced shapes` RED.

### ⭐ THE REPO'S OWN GUARD SHAPED THE DESIGN — and that is the finding
The first draft imported `fighterShapes.ts` from the test and from the lib.
`no-game-imports` went RED: the registry is a runtime module; only the pure-data
art files carry the exemption. The final shape — 22 static generated imports +
a directory cross-check so a new shape cannot land uncovered, roster in the CLI
— is BETTER than the draft, and the guard forced it. (Kickoff §3.3 said keep
`poseRaster` the only unreachable file; it stayed so.)

### ⚠️ CARRIED FORWARD, DECIDED IN ADVANCE
- `a8Colour.test.ts` asserts ONE interior fill per garment — correct for legacy
  blobs, WRONG for re-authored art. The commit that re-authors the first
  garment scopes A8's one-fill + ratchet tests to LEGACY shapes and lets A9-D
  (12 levels, tighter than the 22/22/23 legacy ratchets) take over. Tightening,
  not softening — recorded here so the edit is expected, not silent.
- `colourRuler.py`'s `our_fill` refuses shapes with ≥2 interior fills ("refusing
  to guess") — same handover, same commit.

### Regression
```
suite 50 files / 847 tests green (was 49/827)   tsc x2 -> 0 · eslint -> 0
inkShare CLI after the split: mean 41.4%, worst 61.4%, same two over (9012 75.9, 9001 70.6)
No shape file changed; the render and every committed digest are UNCHANGED.
```

## SESSION 22 — A9.2: THE TWO OVER-INKED GARMENTS ARE RE-AUTHORED. GATE A9-B MET, ALL SEVEN.

**The owner's "one or 2 of them", closed by re-authoring, not by tuning:**
```
                      before      after     bar (OG's own worst)
  9012 collar/juban    75.9%      32.6%       61.4%   ✅
  9001 far sleeve      70.6%      30.6%       61.4%   ✅
  inkShare CLI: "✅ no traced garment is inkier than the OG's own worst part"
```

### The pipeline (new tool, reusable for A9.3–A9.5)
`scripts/art/reauthorGarment.py <id>` — base fill on the EXACT traced
silhouette ring (same `garment_masks` + potrace + rdp + `to_local` pipeline the
committed blob came from, so the outline is the trace's to the millipixel), ONE
hard-edged shadow fill (interior darker than the p25/p75 luma midpoint, 5×5
median first, cleaned, components ≥2% of interior), and an ink stroke of
OG-quantised width. Tones: committed p25/p75 with kickoff D4's SWF preference —
**the collar's base resolved to the SWF's own `#dcd9d4` byte-exact** (measured
p75 (212,210,210), within 12). Then `generate.ts` commits it; the byte
re-derivation gate covers authored shapes exactly as traced ones.

### Decisions
- **D-A9.2a — stroke centred on the silhouette ring** (grows the silhouette by
  w/2 ≈ 0.2 world px) over inset-centreline complexity. The floors ruled:
  held-out **0.8619 → 0.8662**, tracing **0.9006 → 0.9050**, height 140.48 —
  the re-authored art scores BETTER, Risk 1 did not materialise.
- **D-A9.2b — committed floors stay 0.8618/140.5 during the session**; the
  gains ratchet up in one A9.7 commit with the final numbers (SESSION20's own
  pattern). Veto = ratchet each step.
- **D-A9.2c — 9001's two tones are 2 levels apart** because that IS the
  video's spread (iqr 2,2,2). An invisible shadow honestly measured beats an
  invented visible one (kickoff Risk 2's line).

### The A8 → A9 handover, exactly as pre-decided in the A9.1 ledger
`a8Colour.test.ts` now grades LEGACY blobs only (roster shared from
`tests/utils/a9Roster.ts`, so no garment is graded by neither); its failing
pin shrank **[9011, 9012, 9017] → [9011, 9017]** — 9012 left by being
re-authored, not by a raised ratchet. A new both-directions test pins
ratchet-table == LEGACY. `colourRuler.py` grades multi-tone shapes per tone
(base vs p75, shadow vs p25): collar base +8/+7/+2 ✓, shadow exact; 9001 exact.

### Red-first + guards
- Roster flipped BEFORE the art: `every roster shape passes all four gates`
  RED against the still-committed blobs, then green after `generate.ts`.
- **New guard, chaos-proven:** `traceGarment.py` REFUSES to clobber an
  AUTHORED SVG (marker defined once, in `reauthorGarment.py`); ran the full
  tracer — both authored files refused byte-identical, all five legacy SVGs
  re-traced, `svgShape` suite green.
- The over-ink pin did its job and shrank to []: the test is now the full
  A9-B assertion over all seven, and may never grow again.

### Integration pins moved, each with its reason in place
`poseRender`: dressed 55 → 57 ops, 16 → 18 strokes (+1 paint op, +1 stroke per
re-authored garment); GOLDEN_DRESSED re-pinned (idle untouched — the bare
fighter draws no traced art). Ratchet gate: emitter keeps the literal
`APPROXIMATED FILLS:` phrase (D7's "approximations listed, never silent")
with an `(authored)` qualifier — the GATE was not widened.

### Looked at, honestly (band_A + side_by_side, this step's scope)
The collar is a white band with a fine contour instead of an ink-drowned mass;
the far sleeve no longer adds a black slab behind the torso. Still visibly
wrong and NAMED for later steps: kasa texture/fringe (A9.3), the gi's back
bulge + missing white front lapel (A9.4), hakama tone (A9.5), no branch (A9.6).

### Regression
```
suite 50 files / 848 tests green   tsc x2 -> 0 · eslint -> 0
scorePose: tracing 0.9050 · held-out 0.8662 · height 140.48 · digest 8dfc2547…
floors 0.8618 / 140.5 NOT edited (D-A9.2b)
```

## SESSION 22 — A9.3 + A9.5: KASA, HAKAMA AND OBI RE-AUTHORED (fan-out). THE GI IS HELD FOR AN OWNER RULING.

**Produced by a 4-agent parallel fan-out** (kasa · gi · hakama+obi · branch
analysis), integrated serially. Five of seven garments now live in the OG
grammar; the roster is 9001, 9011, 9012, 9014, 9017 with the gi pair last.

### A9.3 — the kasa (36.3 % ink, tones byte-exact to p75/p25)
Base = measured p75 (154,119,57) · shadow = measured p25 (116,84,33) on the
RIGHT cone face where the crop is dark (27.5 % of interior, mask-measured) —
**the ledger-banned darken-toward-median move was NOT taken.** 6 radial weave
ribs w1 in measured dark straw (6 streaks counted in the crop), the band-top
boundary line w1, 13 ink fringe ticks w1 INSIDE the traced brim bumps (~13
counted). D4 checked: neither kasa target is within 12 of an SWF colour.
⭐ **Integration fix, measured:** the agent's on-ring w2 contour raised the
figure top 1.2 stage px → height 141.68 > the 140.5 ceiling. The contour
centreline is now INSET w/2 by raster erosion (D-A9.2a's veto branch, the
method A9.5 validated); ink tops out INSIDE the traced silhouette and height
returned to **140.48**.

### A9.5 — the hakama (21.1 % ink) and obi (26.3 %)
Hakama = **MEASURED_FLAT** (iqr 3,2,5 cited in the roster): ONE fill, the
SWF's own `#dcd9d4` — BOTH percentile targets sit within 12 of it, so a
shadow tone would be invented, not measured. Contour w1.5, centreline inset.
**The hem is 6 structural vertices instead of 24 grass-notch ones** — and the
kickoff's own "cut at the cloth line" idea was EXECUTED, MEASURED, and
REJECTED (held-out 0.775 / 0.846 vs floor 0.8618): the wisp band is occluded
ankle-length cloth. Obi = two tones; **D4's SWF mapping was declined at its
exact borderline (deltas 12,12,6)** because SWF-white would erase the
obi-vs-hakama step the source clearly shows — measured p75/p25 used instead.

### ⛔ THE GI TRADE — the A9-G clause fired, and the numbers go to the owner
A9.4's balloon repair is measured and REAL (back-edge bump prominence 4.80 →
0.53 stage px; the committed A9-E bar of 2 would pass) — but it costs the
held-out floor:
```
                                      tracing   held-out   height
  committed floors                     0.9006    0.8618     140.5
  this commit (kasa+hakama+obi in)     0.9085    0.8634 ✅   140.48
  with the gi repair added             0.9020    0.8529 ⛔   140.48
```
Per-garment attribution measured by clean bisection: gi −0.0105, hakama
−0.0012, inset kasa −0.0016 (additive, reconciles exactly).
⭐ **The cause was found by LOOKING at the held-out frame:** its fighter
stands in a different idle moment whose back side carries real arm/sleeve
mass; the balloon defect was accidentally faking that width. Moving OUR far
sleeve aft to match (measured shift, swept ±2) made BOTH scores worse —
executed, measured, REVERTED. The trade is genuine: the picture is right and
the floor's baseline embedded the defect. **Floors NOT touched; the repaired
gi art is parked in `reference/traced/pending-a9.4/` with its blob SVGs
re-traced byte-exact so the re-derivation gate stays honest.**

### ⚠️ PROCESS FINDS
- **A coordinate-space misread almost condemned a valid gate:** the held-out
  frame's segmentation mask is WINDOW-relative (rows 560..900 re-indexed), and
  reading it as full-frame put "the fighter" on HUD text. The control check —
  run the same instrument on a KNOWN frame first — caught it before any edit.
- **Parallel authoring works, with one lesson:** disjoint files held, but
  whole-figure scores measured mid-flight by agents were contaminated by
  siblings' regenerations; per-shape measures were not. Integration re-scored
  everything serially.

### Regression
```
suite 50 files / 848 tests green   tsc x2 -> 0 · eslint -> 0
scorePose: tracing 0.9085 · held-out 0.8634 · height 140.48   floors NOT edited
inkShare: all seven <= 61.4 % (worst traced: 9012 at 32.6)
poseRender pins: 57 -> 81 ops, 18 -> 44 strokes (kasa detail + inset contours),
GOLDEN_DRESSED re-pinned; idle digest untouched
```

## SESSION 22 — A9.6: THE BRANCH IS ON SCREEN, AT THE MEASURED FACING. GATE A9-F MET — AND ALL FLOORS ROSE.

```
                     tracing    held-out   height
  committed floors    0.9006     0.8618    140.5
  before the branch   0.9085     0.8634    140.48
  branch landed       0.9106     0.8671    140.48   <- every number ABOVE its floor
```

### The facing, measured (the analyst agent's A9-F evidence)
Endpoints read by eye off gridded ×10 crops of three clean stills (zFt_0059/
0060/0061 — 0066/0071 are mid-pan): the stick runs upper-left (776,740) →
lower-right (902,845), axis **+39.9° ± 2**, fork end lower-right. Shape 2641's
local axis is +1.3° (PCA over its committed vertices). The recorded slot-3
rotation 142 renders 143.3° = the horizontal MIRROR of the source (180 − 39.9
= 140.1 ≈ 142) — the `142 = 180 − 38` signature CONFIRMED. **rotation 38 →
rendered 39.3°, residual 0.6° against a 10° bar.** Cleanest single reference:
zFt_0061 (the trace frame itself).

### ⭐ THE MIRROR FLIPS THE POSITION TOO — found by LOOKING, fixed by MEASURING
At the recorded (12, −61) the whole stick floated AFT of the body — a spike of
width nothing occludes — and held-out collapsed to 0.8257. The frames show the
midsection hidden BEHIND the torso and hakama with only the ends emerging.
Measured as bbox-fractions of the source fighter ((0.107, 0.426) → (1.000,
0.865)) and mapped onto ours: node ≈ (−19, −53) — **the x offset flips sign**,
completing the mirror story. Final (−17, −55) chosen inside the mapping's
±2-node-px uncertainty by the committed floors (the A6.4 measure-then-sweep
rule); every candidate in the sweep is ledgered above the floor or rejected.

### The mechanism — the recorded pose is never edited
`OG_EQUIPMENT` (config) carries `{shapeId, rotationDeg, x, y}`;
`OG_DRESSED_NODES` is DERIVED, and `tests/a9Branch.test.ts` pins that it
differs from the byte-checked `OG_IDLE_NODES` in slot 3's transform ONLY —
including the sign flip. The bare fighter still composes from the recorded
nodes verbatim; the bindata byte-check suite is untouched. Red-first: all 6
gate tests watched red before the config existed.

### What it cost, honestly
The fork tip is now the fighter's widest point (ink maxX 538.9 → 545.7) —
exactly what the source shows. poseRender pins moved with reasons in place:
21 parts, 96 ops (+10 fill/+4 stroke/+1 holedFill = 2641's own art), crop
width 115 → 122, new golden digest. 2641 joined `FIGHTER_SHAPES` and the two
test-side shape maps (its absence threw in `planPose`, which is the guard
working). `inkShare` drops its manual append — the registry owns the branch.

### Regression
```
suite 51 files / 854 tests green   tsc x2 -> 0 · eslint -> 0
scorePose: tracing 0.9106 · held-out 0.8671 · height 140.48 — floors NOT edited
(the ratchet-up decision belongs to A9.7, after the gi ruling)
```

## SESSION 22 — A9.4 LANDED BY OWNER RULING. GATE A9-A MET IN FULL: ALL SEVEN GARMENTS, AND GATE A9-E GREEN.

⭐ **THE RULING (owner, in-chat, 2026-07-28):** *"not perfect, but i will accept
it for now, will change later, in another session."* — the gi balloon repair
ships, and this commit is the ONE allowed to re-base the held-out floor.

```
                    tracing      held-out     height
  floors before      0.9005       0.8618      140.5
  measured, landed   0.900547 ✅   0.849033    140.48 ✅
  floors after       0.9005       0.8490 ⬅ RE-BASED BY THE RULING, cited in-file
```
The tracing floor HOLDS untouched. The held-out re-base is larger than the
pre-branch attribution predicted (−0.0181 vs −0.0105 — the branch/gi rows
interact through the profile normalisation); both numbers are honest and the
cause is unchanged (the balloon faked the held-out frame's stance width).

**GATE A9-E, red-first for real:** `tests/a9GiProbe.test.ts` — the back-edge
hem-overhang metric (peak past the hem's own width; the balloon's exact
signature). ⚠️ **Two wrong metrics died first, caught by dumping the profile
instead of trying a third variation:** "secondary local maximum prominence"
scores the balloon 0 (it IS the global max), and "peak above later maximum"
scores a monotone decline by its largest single step. The landed metric reads
**3.50 local px RED on the balloon** (the agents' 4.80 stage within binning)
and **0.4 GREEN on the repair**, colour-blind across legacy/authored structure.

LEGACY and the A8 ratchet table are now EMPTY — every exit by re-authoring or
by this ruling, never by a raised number; the mechanisms stay for any future
traced shape. Pins: 96 → 103 ops, 48 → 54 strokes, new digest, reasons
in-file. suite **52 files / 855 green** · tsc ×2 → 0 · eslint → 0.

## LANE L2 — THE SKILL TABLE IS TRANSCRIBED. TWO COOLDOWNS RE-SOURCED, ONE DECLARED AUTHORED.

`OG_SKILLS` (`src/config/ogSkills.ts`) now carries all **75 skills × 182 level
rows** from `reference/extracted/skilldata.xml`, generated by
`scripts/payload/transcribeSkills.py` and byte-checked field-for-field by
`tests/ogSkillData.test.ts` against an **independent** parser. Three entries
follow from it.

- **`chiPunch` cooldown 4960 → 5000 ms. A [CONTRACT] label was wrong.** The old
  value was read off-screen (A-02 t=7:05) as 4.96 s and graded CONTRACT. The
  payload states it outright: Chi Punch (skill 1042), every level,
  `<cooldown>5</cooldown>`. GAUNTLET.md §1 — *"any lane that frame-counts a
  number the payload states outright has failed its own gate."* 4.96 s is what a
  5.00 s timer reads as when quantized to the HUD's frame cadence.
  **Veto** = restore 4960 in `skills.ts` + `config-values.test.ts` in one commit,
  and record that a frame-read outranks the source here.

- **`smokeBomb` cooldown 7960 (INFERRED) → 6000 ms (CONTRACT-SRC).** Smoke Bomb
  (skill 1010) level 1 is `<cooldown>6</cooldown>`. The 7960 came from a claimed
  ".92/.96-ending pattern" that no source supports — the payload's cooldowns are
  plain integers (2, 4, 5, 6, 10, 15, 20, 30, 60, 70) with exactly one fractional
  value in the entire table (Roll, level 2, 3.5 s). **The .92/.96 pattern is
  hereby dead as a source of INFERRED values.**
  ⚠️ The OG cooldown *drops with skill level* (6 / 6 / 5). The duel has no skill
  levels, so we ship level 1. **Veto** = ship level 3's 5000 instead.

- **`stab` 920 ms is AUTHORED — no longer INFERRED, because there is nothing to
  infer.** The original's Stab (skill 1018) is a **PASSIVE** Heavy-stance skill
  with no cooldown at all, and its three Deflect skills (1036/1037/1038) are
  passives too. Our `stab` is a cooldown-gated deflect window that swats kunai —
  a mechanic the OG does not have — so 920 ms cannot be sourced and is ours.
  Relabelling it INFERRED→DIVERGENCE is an accuracy fix, not a gate softening:
  INFERRED asserts "this is our guess at the OG's number", and the OG has none.
  **Veto** = drop the verb and model Stab as a passive — an **L5** change to
  `Sim.ts`, not a config edit.

- **The `<req>` prerequisite tree was nearly lost, and the byte-check caught it.**
  The generator's first cut read `<req>` as a scalar; ElementTree returns empty
  text when the data is in children, so all **52** prerequisites
  (`<req><has><id>N</id><qty>M</qty></has></req>`) would have shipped as "present
  but empty". The closed-vocabulary assertion saw a `<qty>` tag the generator
  never walked. Both parsers are now recorded as deliberately independent.
  ⚠️ Prerequisite ids live in **two spaces** the source does not distinguish:
  1000–1054 are skill ids; **28–31** are something else (qty 10/30/60). This lane
  records them verbatim and **attaches no meaning** to 28–31.

- **⚠️ C2 applies to every row here.** `skilldata.xml` is the **Android** build;
  the web payload carries no `<skilldata>` root. All 182 rows are **v0.682** until
  a web-side artifact corroborates them (GAUNTLET.md §2.1).

## LANE L2 (meters half) — THE THIRD BAR GETS ITS CAPTION. AP IS NOT A BATTLE METER.

- **The original's battle HUD has exactly THREE bars, and AP is not one of them.**
  Stated outright by the source, not inferred from a frame:
  `reference/decompiled/shs3_android/scripts/BattleUI.as` declares `hpbar`,
  `chibar` and `reloadbar` — and nothing else. `updateHp` / `updateChi` /
  `updateReload` are the only bar writers. **The lane gate's phrase
  "Chi/Focus/AP meters real" names a meter the battle HUD does not have.** AP is
  real as a *stat* (Player-sheet pool, `SYNTHESIS.md:120-122`); it is never
  rendered in a duel. Rendering one would have been an invented HUD element.
  **Veto** = add an AP bar anyway, and diverge from `BattleUI.as` on purpose.

- **The Focus bar's caption — three states, transcribed not guessed.** From the
  web build's own update function
  (`reference/decompiled/shs3_payload/scripts/§1t113s0§.as:325-359`):

  ```as3
  var pct:Number = (param1 - 48) / (param2 - 48);   // clamped at 0
  if(pct == 0)                -> "<font color='#BBBBBB'>" + getString(960)
  else if(pct > 0 && pct < 1) -> visible = false
  else if(pct >= 1)           -> Snd_criticalDamage; "<font color='#000000'>" + getString(175)
  ```

  `getString(175)` = **'Critical Hit'**. `getString(960)` resolves to **nothing** —
  it is **absent from the android string table**, exactly as C4 predicted, so its
  text comes from A1: the frame prints **CANNOT CHANGE STANCE** on that bar
  (`reference/frames/combat_analysis/Nr4fQstqHDM_t428.5.png`).
  The middle state is the non-obvious one: a partly-charged meter **hides** the
  field rather than blanking it. Decided in `core/focusCaption.ts`, red-proofed.

- **`(focus - 48) / (max - 48)` is now corroborated by the WEB build.** Our
  `FOCUS_DISPLAY_OFFSET = 48` / `FOCUS_DISPLAY_SPAN = 144` were CONTRACT-SRC on
  C4's evidence; the same arithmetic appears verbatim in the web HUD. The stale
  `DuelScene` comment calling the Focus meter "our INFERRED meter" is corrected.
  ⚠️ The **android** build uses **24**, not 48, in the same expression
  (`MCSPlayer.as:1168, :3272`) — a live web-vs-android divergence (C2). We follow
  the **web** build, which is what v0.717 and both longplays are.

- **Caption geometry is MEASURED, and the original's face is CONDENSED.** In A1 at
  stage scale 1920/1024 = 1.875: cap **17 px @1920 = 9.07 stage px**, caption box
  **235 px = 125.33 stage px** for 20 characters. Our font at the cap-matching
  size 12 renders the same string **175 stage px** wide — 1.38× too wide, spilling
  past the 142 px bar the original keeps it inside. `scaleX = 125.33/175 = 0.716`
  reproduces BOTH measurements. **Veto** = font ~8.6 to match width alone, 27% short.
  Corroboration found in the same pass: the Chi bar measures **264 px = 140.8
  stage px** against our committed `barLen` of **142** — under 1% apart.

- **A defect only the screen could find: black caption + black outline = invisible.**
  Our dark outline is a convention inherited from the HP/Chi labels, where
  white-on-colour needs it. The source gives these captions only a font colour, and
  the FULL-meter caption is `#000000` on a near-white bar. Outlining it rendered it
  unreadable. Stroke is now per-state (`lockStrokePx: 3`, `critStrokePx: 0`).
  No test would have caught this; it took a zoom on a running build.

- **Known remaining mismatch, NOT fixed here and NOT in this gate.** A1 shows
  **`150% DAMAGE`** in gold beneath the bars; we render **`BALANCED STANCE`**. That
  is a stance/damage readout, not a meter, so it belongs to **L8 (UI + screens)**.
  Recorded rather than silently changed.

## LANE L3 (data half) — THE ITEM TABLE IS TRANSCRIBED. FOUR SHAPES A READER GETS WRONG, AND ONE TYPO IN THE SOURCE.

`OG_ITEMS` (`src/config/ogItems.ts`) now carries all **982 items** and every one of
the **412 repeated `<modifier>` rows** from `reference/extracted/itemdata.xml`,
generated by `scripts/payload/transcribeItems.py` and byte-checked field-for-field
by `tests/ogItemData.test.ts` against an **independent** parser (raw-text regex here
vs ElementTree in the generator). Six entries follow from it.

- **The `<modifier>` trap was real, and it is the `<req>` trap doubled.** Its data is
  in CHILDREN *and* it REPEATS up to 10× per item, so `findtext()` returns nothing and
  `find()` returns 1 of 10. **412 rows live in only 93 items.** Recorded VERBATIM as an
  ordered `{ id, value? }` list with **no meaning attached** — the id-space is unmapped
  (34 distinct ids, `0..40000`; values `-1000000..9902095`).
  ⚠️ The id-only form is **a property OF THE ID, not a data gap**: 11 of the 34 ids
  (`25, 78, 79, 90, 96, 97, 98, 99, 101, 104, 105`) are *always* id-only and the other
  23 *always* carry a value. Resolving ids to stat names would erase that evidence.
  **Veto** = map the 34 ids to stat names, and make 34 guesses this lane cannot source.

- **`<unique>` is NOT a boolean — the source uses 1 (253×) and 2 (116×).** Shipping it
  as `unique: true` would have silently collapsed 116 rows into a state the original
  distinguishes. Recorded as the number.
  **Veto** = `boolean`, and lose whatever 2 means.

- **`<art>` is an ITEM → ITEM pointer, not a sprite id — so it lands in THIS half.**
  All 68 distinct targets are item ids in this same file, and **no target carries its
  own `<art>`** (no alias chains; both facts asserted, and the generator dies on either
  breaking). It means *"render me using item X's artwork"*; art 2130 is shared by 39
  items. The L3 kickoff assumed it was the paperdoll's sprite link and asked whether it
  should wait for the compositing half; it is an ordinary scalar field of the item
  table, and deferring it would have forced a second transform over the same 982 rows.
  **Veto** = hold `art` for the compositing half, and re-run the whole transform to add
  one integer.

- **`<baseprice>.</baseprice>` — item 11037, "Santa Pants". A typo in the shipped game.**
  The only non-numeric value in 184,002 bytes. It is **not coerced** (0 would invent a
  free item, a price the original never gave) and **not dropped**: the field is omitted
  from the typed row and the raw text is preserved in `OG_ITEM_SOURCE_ANOMALIES`, which
  the byte-check pins **exactly**. A *second* anomaly appearing in the source therefore
  turns the suite red instead of vanishing, and a *fabricated* anomaly fails too — the
  test counts what the sweep actually found. Chaos-planted both directions.
  **Veto** = `baseprice: 0` for 11037, and state a price the source does not.
  ⚠️ **`<minlvl>` is NEGATIVE on 13 rows** (to −4, all type-9 weapons, ids 13001–13114).
  Recorded verbatim; this lane attaches **no meaning** to a negative minimum level.

- **⚠️ TWO COINCIDENCE TRAPS, both verified DISJOINT and both pinned by a test.** These
  numbers collide by accident and a future reader will conflate them:
  - **412 modifiers live in 93 ITEMS**, and **93 MODIFIER ROWS are id-only.** Different
    93s — 37 of those items carry exactly one modifier, so they cannot be the same set.
  - **178 items have no `<name>`**, and **178 items carry a `<desc>`.** Different 178s:
    **zero** unnamed items have a desc. The unnamed rows are not junk and not a lookup
    failure (`resolved_names.json` reports itemdata **804 / 0 misses**) — they are the
    **base body/armor art**, carrying no desc, no art and no modifier, ever, and **151
    of the 178 are worn by an NPC paperdoll** in `npcdata.xml`. `name` is therefore
    OMITTED rather than marked: `name?: string` already says "absent" unambiguously.
    **Veto** = add an `unnamed: true` marker, and invite filtering on it instead of on
    `name === undefined`.

- **⚠️ C2 applies to every row here.** `itemdata.xml` is the **ANDROID** build; the web
  payload carries no `<itemdata>` root. All 982 rows are **v0.682** until a web-side
  artifact corroborates them (GAUNTLET.md §2.1).

## LANE L3 (compositing half) — THE SLOT VOCABULARY. ⚠️ THIS HEADING SAID "12 TAGS, NOT 9" AND WAS SUPERSEDED THE SAME DAY: IT IS 13 / 12 / 9 AND ALL THREE ARE RIGHT (see the self-correction inside).

**Recorded now, built later — this half's gate is a frame grade and Kheshav's LOOK.**

- **⚠️ SELF-CORRECTION, same day, owner-ruled: "the gate text is wrong" was an OVERSTATEMENT.**
  This entry first said §2's *"9-slot compositing contract"* contradicted the payload's 12
  and that the lane text was simply wrong. **It is not.** Both numbers are measured and
  both are right — they count different things, and the first draft of this entry cited
  only the payload without opening the doc the 9 came from.
  - **9 is the EQUIP SCREEN** (A1, `SYNTHESIS.md` §1.3, cite A-13): Hat, Mask, Garment,
    Gloves, Pants, Weapon, **Ring L, Ring R**, Sandals — what a player can equip.
  - **⚠️ SECOND SELF-CORRECTION, same session: "12" was also incomplete.** The first fix
    read `npcdata.xml` and stopped. Opening the AS3 gives **three** numbers that reconcile
    exactly (**9 + 4 = 13**):
    - **13 = the equipment MODEL** — `StatsManager.as:262-286`:
      `EQ_ARMOR 0 · EQ_GLOVES 1 · EQ_HAIR 2 · EQ_HAT 3 · EQ_HEAD 4 · EQ_MASK 5 ·
      EQ_NECK 6 · EQ_PANTS 7 · EQ_SHOES 8 · EQ_WEAPON 9 · EQ_SCABBARD 10 ·
      EQ_ACCESSORY1 11 · EQ_ACCESSORY2 12`.
    - **12 = what the RENDERER takes** — `MCSCharacter.as:300`, `initMCS(armor, gloves,
      hair, hat, head, mask, neck, pants, shoes, weapon, propid, prop2id)`.
    - **9 = the EQUIP UI boxes**, the stat-granting slots. `EQ_HAIR`, `EQ_HEAD`, `EQ_NECK`
      and `EQ_SCABBARD` have no box; the two rings (`EQ_ACCESSORY1/2`) are the reverse —
      equipped and stat-granting, but **never drawn**.
  - **`prop1` IS the scabbard**, not a generic prop — `XMLNpc.as:398` writes
    `"<prop1>" + equipment[StatsManager.EQ_SCABBARD].getItemID() + "</prop1>"`.
  - §2's L3 row now names **all three** rather than picking one; §1's "10-slot paperdoll"
    is corrected; `SYNTHESIS.md` is **relabelled** *"EQUIP SCREEN: 9 slots"* with its
    measurement **untouched**, because the frame still wins on what the frame measured.
    Calling that list a "paperdoll" is the whole root cause. Cites: **GAUNTLET.md §2.2**.
  **Veto** = put a single number in the L3 gate, and lose whichever two it isn't.

- **⚠️ THE `<mcs>` ORDER IS NOT THE Z-ORDER — but it is NOT meaningless either, and the
  first version of this entry got that backwards too.** It is the **EQ index order**,
  mirroring the `mcsString` that `initMCS` builds
  (`armor|gloves|hair|hat|head|mask|neck|pants|shoes|weapon|prop|prop2`,
  `MCSCharacter.as:349`); it only *looks* alphabetical because indices 0–9 were assigned
  that way. All **490** NPCs carrying an `<mcs>` obey it with **ZERO** violations.
  ⚠️ **The draw order is a different sequence entirely** — `initMCS` calls
  `setHead → setMask → setHatHair → setHair → setHat → setNeck → setArmor → setShoes →
  setPants → setGloves → setWeapon → setProp`. **That is the lead for the compositing
  half; neither order is proven to be draw depth.** Compositing in `<mcs>` order would be
  confidently wrong and **no test in this repo would catch it**. Settle it with the FLA
  child depths or an A1 frame.
  ✅ **The AS3 corroborates this lane's data half:** `initMCS`'s naked fallbacks name the
  base body art — armor 4000, gloves 5000, hair 6000/6001, hat 7000, mask 9000, neck
  10000, pants 11000, shoes 12000, weapon/prop 13000. **8 of those 10 are unnamed rows in
  `OG_ITEMS`.** ⚠️ The two hair defaults are the exception — 6000/6001 DO carry a `<name>`
  (*"Hair"*) and a `<desc>` — so **"unnamed" is not a safe test for "is base art"**; the
  id band is.
  ⚠️ HYPOTHESIS, not a finding: **741 of 3,210 slot values are comma-separated lists**
  (hair 355, weapon 176, mask 72, hat 43, armor 39, pants 30, shoes 15, head 11) with `0`
  meaning empty — a likely per-NPC randomisation pool. **L4 owns proving it.** L4 must
  also not drop `<mcs>`'s per-slot colour overrides (`<armorpcolor>` etc.,
  `XMLNpc.as:367-374`).

- **`<type>` IS the paperdoll slot, and the id band proves it** — every `<mcs>` slot
  resolves to exactly one item `<type>`: gloves→1 · hair→2 · hat→3 · head→4 · mask→5 ·
  neck→6 · pants→7 · shoes→8 · weapon/prop1/prop2→9, with id bands 5k/6k/7k/8k/9k/10k/
  11k/12k/13k matching one-for-one.
  ⚠️ **The `armor` slot's items carry NO `<type>` at all** — that is why 153 of 982 items
  are typeless (152 in the 4k band, plus the orphan 7075). Slot cannot be keyed on
  `<type>` alone; the 4k band identifies armor.

- **⚠️ L4's landmine, found early and banked: `<mcs>` is the `<req>` trap a third time.**
  Its data is in CHILDREN, so `.text` returns `'\n\t\t\t'` and **all 3,210 paperdoll
  entries across all 495 NPCs would ship empty**. Worse, a slot's value is sometimes a
  **comma-separated list** (e.g. `'0,0,0,...,7003,7008,...'`) with `0` meaning empty, so
  "one item id per slot" is also wrong. L4 must dump its recursive vocabulary first, as
  L2 and L3 did.

## LANE L3 (compositing half) — THE CONTRACT IS TRANSCRIBED, AND AN INFERRED Z-ORDER WAS HALF WRONG.

`OG_COMPOSITING` (`src/config/ogCompositing.ts`) carries the original's paperdoll
compositing contract, generated by `scripts/payload/transcribeCompositing.py` from
`MCSCharacter.as` + `StatsManager.as` and byte-checked by
`tests/ogCompositing.test.ts` against an **independent** parser (line-oriented
scanning there, whole-file regex in the generator).

- **ONE equipment slot dresses MANY part slots — so "9 / 12 / 13" and "27 parts"
  are related by a MAP, not by counting.** `setArmor` alone writes **eight**
  (`uparm ×2, lowarm ×2, neck, stomach, pelvic, torso`); `setPants` writes five;
  `setShoes` four; `setGloves` two. The 11 dressing slots and their parts are
  transcribed verbatim. **`EQ_ACCESSORY1`/`EQ_ACCESSORY2` dress NOTHING** — the
  rings are equipped and stat-granting and the renderer never receives them, and
  the test asserts exactly those two are absent.
  **Veto** = flatten the map to one part per slot, and lose seven eighths of the armor.

- **⛔ THE INFERRED WITHIN-SLOT Z-ORDER WAS HALF WRONG, and the payload states it.**
  `ogPose.ts` declared *"calf before foottop, head before hair"* **the only inferred
  thing in the file** — *"no frame proves it"*. The source proves it, and splits:
  - **head before hair ✅ CONFIRMED.** The head stack is pinned four deep and
    explicitly: `head 0 · headMask 1 · hatHair 2 · hair 3`, back to front.
  - **calf before foottop ⛔ REVERSED.** `setShoes` pins the **foottop to child
    index 0 — the BACK — with an explicit `setChildIndex`**, and `setPants`
    plain-`addChild`s the calf, which lands in **FRONT**. Because the index is
    *pinned*, the order does not depend on which setter `initMCS` runs first.
  Slots **7 and 11** are corrected `[2678, 2672]` → `[2672, 2678]`. GAUNTLET.md §1:
  a lane that infers a number the payload states outright has failed its own gate.
  **Veto** = restore `[calf, foottop]`, and record that a construction-order guess
  outranks the source's own explicit `setChildIndex`.

- **The blast radius was measured, not assumed.** `GOLDEN_DRESSED` is **UNCHANGED**
  (`ebf871c5…`) because the traced hakama `9011` replaces both shapes on slots 7 and
  11 — so the DRESSED fighter is bit-identical and **the floors provably did not
  move**, being a pure function of that raster. Only `GOLDEN_IDLE` moved
  (`6dae62d1…` → `aedc52d1…`), re-baselined ONCE, deliberately, with its reason
  in-file, exactly as that test's own comment requires.
  ```
  floors after the change   tracing 0.9185 (floor 0.9005) · held-out 0.8597 (floor 0.8490)
  fidelity gate             pass: true, points: 41, scans: 14, failed: 0   (unchanged)
  ```

- **⚠️ ART IS RESOLVED BY NAME AND WE DO NOT HOLD IT.** `getMCSComponent(prefix,
  itemId)` looks up a symbol like `torso4085` and falls back to a naked class
  (`new torso4000()`). Those symbols live in the CDN-hosted asset SWFs that died
  with the studio. **This is why the repo can carry all 982 item ROWS and still
  render only the outfit it traced by hand** — the contract is portable, the art is
  not. Recording the contract is this lane's job; inventing the art is not.

- **✅ The naked fallbacks corroborate the data half from the other side** —
  torso/…**4000** · hand**5000** · hair**6000** · hat**7000** · head**8000** ·
  mask**9000** · neck**10000** · calf/thigh/crotch**11000** · foot/foottop**12000** ·
  weapon/prop**13000**. Those are exactly `itemdata.xml`'s `<type>` id bands.

- **⛔ THE A1 GRADE — the layer order is RIGHT, and one garment is MISSING ART.**
  Ours vs `reference/frames/s19_trace/zFt_0061.png` (t=590.0 s), overlay at
  `renders/L3_overlay.png` (theirs RED · ours CYAN · agreement WHITE):
  **the order is correct** — hat over head over hair, gi over torso, near sleeve
  over gi body, hakama over legs. **The OG carries a SCABBARD that we do not draw
  at all** (the red mass at mid-left and lower-right). That is part **4** (`prop`),
  fed by **`EQ_SCABBARD`** — and `OG_SLOT_SHAPES[4]` is EMPTY BY DESIGN because
  `prop13000` holds zero shapes. So the scabbard is an **equipped item whose art
  died with the CDN**, not a layering defect — and the contract above is what
  says so. Remaining silhouette differences: our hakama flares wider at the lower
  left, our gi shoulder is bulkier. **Owner LOOK verdict pending; this half of the
  lane stays OPEN until it is logged.**

## LANE L3 — ⛔ OWNER LOOK VERDICT: **REJECTED.** THE GATE THAT PASSED IS NOT THE GATE THAT MATTERS.

**⭐ THE RULING (owner, in-chat, 2026-09-05), logged verbatim as A5:**
> *"to be fair it ddint lok liek the video i sent, can we do it in a new session make the
> kicoff so we can continue with improvement"*

**L3 does not close.** The lane's own gate says *"a dressed fighter composites in the OG's
layer order **against A1**"*, §0 makes the owner's LOOK an artifact (A5), and the LOOK says
no. The compositing CONTRACT half stands (`1b9b479`); the **fidelity** half is reopened.

- **⚠️ EVERY AGGREGATE MEASURE AGREED, AND THE EYE STILL DISAGREED. That is the finding.**
  Measured this session against `zFt_0061.png`, figure-normalised:
  ```
                        OURS        OG          delta
    silhouette score    0.9185    (floor 0.9005)  PASSES
    aspect w/h          0.521       0.530         0.009
    white coverage      31.0%       31.8%         0.8 pp
    dark-ink coverage   32.2%       31.6%         0.6 pp
  ```
  `compareToSource.py`'s own docstring predicted exactly this — *"a silhouette score is
  blind to colour, to paint order, and to a garment on the wrong slot… the loop is a net,
  not a judge — look at the overlay."* It was right, and the net caught nothing.
  **A gate that four independent aggregates pass while the owner rejects the render is not
  measuring the thing the lane is for.**

- **The defects the aggregates cannot see, measured in the same pass** (band = fraction of
  figure height; width = mean filled px at the OG's own scale):
  | band | ours | OG | what it is |
  |---|---|---|---|
  | hem/feet (0.88–1.00) | width **85.3** | **69.0** | ours **24% too wide** — two splayed bulbous legs where the OG has ONE tapering column, and our sandals are visible where the OG's are covered |
  | obi/waist (0.52–0.62) | rgb (89,69,74) | (100,95,95) | the OG's **white obi + white juban panel down the front**; ours renders that block grey |
  | kasa (0.00–0.18) | rgb (91,60,40) | (105,82,43) | ours too **red-dark**; the OG's straw is **golden** |
  Plus, visible at 4× and carried by no measure at all: **two black chest crests**, **straw
  texture lines radiating from the kasa apex**, a **fringed/serrated brim underside**, a
  **two-tone gi** (lighter front panel), and a **larger black hair mass** behind the neck.

- **⚠️ TWO CORRECTIONS TO MY OWN GRADE IN `1b9b479`, both from working off too small an
  image.** (1) I reported the **scabbard as missing entirely**; at matched scale it **is
  drawn** — thinner and shorter than the OG's, but present at both the upper-left butt and
  the lower-right tip. (2) I reported *"the layer order is correct"* as if that closed the
  visual question; **it does not** — the order is right and the render still reads wrong,
  because the gap is garment SHAPE, COLOUR BLOCKING and DETAIL, not z-order. The z-order
  correction in `1b9b479` stands on its own AS3 evidence and is unaffected.
  **Veto** = treat `1b9b479`'s A1 grade as the closing verdict; it was superseded by A5
  the same day.

- **What this does NOT reopen.** The data half (`652eebb`, 982 items byte-exact) and the
  compositing CONTRACT (`1b9b479`, equipment→part map + within-part z-order from
  `MCSCharacter.as`) are both evidence-backed and untouched by this verdict. The reopened
  work is the traced ART and the gate that grades it — continued in
  `docs/sessions/L3B_KICKOFF.md`.

---

## LANE L3B — THE GATE THAT CAN SEE COLOUR BLOCKING, AND THREE GARMENTS THAT CANNOT BE REGENERATED

**The lane the owner's REJECT opened (A5, 2026-09-05). It is NOT closed.** The dressed
fighter still does not read as the video's fighter; what changed is that the repo can now
*measure* the difference, the two loudest defects are gone, and every remaining one is named,
numbered and attached to a cause.

### ⭐ Why four aggregates passed a rejected render — MEASURED, not theorised

`compareToSource.py` predicted the failure mode; this lane found the mechanism. **The
defects cancel.** Our render carried NO white above the hip — the juban and obi are painted,
in `sourceColour.ts`'s own measured whites, and then *covered* by the gi's silhouette — and
too much below it, one traced leg drawn twice. Summed over the figure they annihilate:

```
                       whole figure        worst BAND cell
white share            31.0% vs 31.8%      obi/waist  3.9% vs 20.9%
max |delta|, any class      2.5 pp                 28.2 pp
```

⇒ **GATE A13-A** (`tests/a13Bands.test.ts`, `scripts/art/bandLedger.ts`,
`scripts/art/sourceBands.ts`): six bands × five paint classes = 30 cells, our side from the
raster with the magenta backdrop divided back out, the source side committed as derived data
so it runs with no `reference/`.

- **The tolerance is not a judgement call.** Both source frames are measured; their
  per-cell disagreement IS the noise floor, and the bar is `max(5 pp, 2 × that spread)` —
  the argument `sourceProfile.ts` makes with `FRAME_TO_FRAME_CEILING`. The grass-contaminated
  hem cells self-neutralise (spread 34.8 / 21.1 / 12.2 pp) without anyone widening anything.
- **The classifier is the repo's own evidence.** Nearest of nine anchors, every one a colour
  a committed shape actually paints. An earlier ad-hoc brightness/saturation cut sorted the
  source's bright straw into SKIN; that is the drift this avoids.
- **RED-PROOFED AS AN EXECUTABLE ARTIFACT.** The pre-change ledger is recorded in the test and
  the same rule is pointed back at it: 8 named cells fail, worst overshoot 23.169 pp. Soften
  `GATE_A13A`'s constants and that test goes red, because the rule would start accepting the
  render the owner rejected. Chaos-planted twice (tolerance 5→30 pp; squared→Manhattan
  distance) and watched red both times.
- **⛔ ITS BLIND SPOTS, DECLARED — the last gate's were not.** A band integrates across the
  row, so left-right arrangement is invisible; it grades an ink BUDGET, so a crest and a
  smear of equal area are one number; the source's own mask includes grass; one frame, one
  pose. **A green A13-A is necessary and not sufficient. The gate is still the owner's LOOK.**

### ⭐ THE FIX THAT LANDED: a dressed fighter has no bare feet

`zFt_0061.png` shows **no foot at all** — the white column runs into the grass. The
compositing CONTRACT agrees rather than objecting: `setShoes` dresses parts 5/7/9/11
(`ogCompositing.ts` ← `MCSCharacter.as`), so a dressed fighter's feet wear SHOE art, and that
art died with the CDN. Painting the naked foot on a dressed fighter was the divergence.
`OG_SLOT_SHAPES` (the bare doll, a real game state) is untouched.

```
sealed tracing   0.9005469 -> 0.9123479     floor RAISED 0.9005 -> 0.9123
sealed held-out  0.8490331 -> 0.8566378     floor RAISED 0.8490 -> 0.8566
height           140.48 -> 138.26 stage px  ceiling LOWERED 140.5 -> 138.3
aspect w/h       0.521 -> 0.533             (source 0.530)
A13-A worst      23.169 -> 12.778 pp        ratchet committed at 12.78
```

⚠️ **THE OLD FLOORS HAD ZERO HEADROOM AND NOBODY HAD NOTICED.** The render sat at
**0.9005469** against a 0.9005 bar and **0.8490331** against 0.8490. `RESUME_HERE` reported
*"silhouette 0.9185 (floor 0.9005)"* beside them — 0.9185 is the DIAGNOSTIC score from
`compareToSource.py`, whose own header says the two *"must never be quoted as each other."*
They had been, and it read as headroom that did not exist.

### ⛔ TWO ITEMS OF THE KICKOFF'S GAP LIST ARE REFUTED

1. **"The kasa is the wrong colour" is FALSE as a palette claim.** Its fills are `0x9a7739`
   and `0x745421` — **byte-exact** to `sourceColour.ts`'s p75 (154,119,57) and p25
   (116,84,33). So are 9012's, 9014's and 9015's. **Not one garment has a wrong hue.** The
   band mean differs because the AREAS differ: ours is 36.7 % ink in the kasa band against
   25.8 %, and carries 0.1 % of the source's 9.9 % bright-straw class.
2. **"The white juban / obi is missing" is an OCCLUSION bug, not a missing garment.** Both are
   drawn in the right white and then painted over: at the committed nodes 9014's bbox
   (x −8.83…2.73, y −61.24…−50.57) sits **entirely inside** 9015's (x −17.00…13.66,
   y −89.55…−47.77), and 9015 is slot 15 — in front of 14. The fix belongs on **9015**.

### ⛔ THE BLOCKER, AND IT IS THE FINDING WITH THE LONGEST REACH

Every `shape90NN.ts` says *"GENERATED — DO NOT EDIT. Regenerate with the command below."*
**AUDITED 2026-09-06 — for three of the seven that promise is FALSE:**

| shape | regenerates? | what a rerun destroys |
|---|---|---|
| 9001 · 9011 · 9012 · 9014 | ✅ path for path | — |
| **9017** kasa | ⛔ 6 paths → 3 | the 6 radial weave ribs and 13 fringe ticks (A9.3) |
| **9019** near sleeve | ⛔ 6 paths → 3 | its own detail paths |
| **9015** gi | ⛔ 4 → 3 **and the outer ring moves** | the SESSION 22 balloon repair — **GATE A9-E 0.44 → 3.50 local px**, the defect that took an owner ruling to close |

**This happened, to this lane, and only A9-E caught it.** So the guard now lives where the
danger is: `reauthorGarment.py` **refuses to write an SVG with fewer paths than the one it
would replace**, naming what would be lost. Losing detail is now a deliberate act.

⇒ **The white-column fix is BLOCKED on that.** It needs 9015 re-authored, and 9015 cannot be
re-authored without reintroducing the balloon. Two widenings were measured and both rejected:
crop + window → held-out 0.8649 → **0.8385, below its floor**; window alone → held-out
0.8649 → 0.8634 for +0.0015 tracing. A6.5 reached the same verdict from the opposite side.

### 🔧 What the lane built for the blocked work

`reauthorGarment.py` gained **`tones: N`** — the 2-tone grammar generalised to the tones a
garment actually has, found by deterministic 1-D k-means over the interior's own luma with
the outline excluded by `INK_MAX`, merged at `D4_TOLERANCE`. **Opt-in**, so every garment that
does not declare it keeps its committed bytes (verified: 9011 still reproduces byte-exact).

Run against the gi it finds three tones, and **the middle one lands on `#9e9a97` — the SWF's
OWN palette colour, byte-exact.** That is the confirmation that the "two-tone gi" in the gap
list is real and not a clustering artefact. It measured, on a regenerated 9015: tracing
0.9249, held-out 0.8649, `gi body/ink` green. **Not shipped** — it rides on the ballooned
outline. It ships the day 9015's repair is reproducible.

### 📋 THE EIGHT CELLS STILL OPEN — named in `tests/a13Bands.test.ts`, which may only shrink

| cell | ours | source | cause |
|---|---:|---:|---|
| `obi/waist/white` | 3.2 % | 20.9 % | the obi is painted, then covered by 9015 |
| `hem/feet/ink` | 21.1 % | 3.3 % | both traced panels close with a hard stroked hem |
| `obi/waist/ink` | 43.3 % | 32.0 % | five outlines cross the waist where the source has two |
| `gi body/grey` | 64.0 % | 52.4 % | one flat grey where the source has three tones |
| `kasa/skin` | 0.1 % | 9.9 % | the bright straw band is not painted |
| `head/collar/white` | 1.0 % | 9.3 % | the juban collar is behind 9015 |
| `obi/waist/skin` | 14.7 % | 8.0 % | the hand reads larger against a narrower figure |
| `gi body/ink` | 24.9 % | 30.7 % | the two black crest marks are not drawn |

Measured per row, our hakama is clean (5–10 % ink) down to 0.949 of its height and then the
last six rows run 43–60 % ink — the hem, not the feet. The source is clean white to 0.893 and
grass-swallowed below.

**⚠️ THE OWNER HAS NOT LOOKED AT THE POST-CHANGE RENDER. Until he does, L3B stays OPEN and
nothing here claims otherwise.**

---

## LANE L3B (cont.) — THE OWNER NAMED THREE DEFECTS. ONE IS FIXED, ONE IS RULED OUT BY MEASUREMENT, ONE IS STILL BLOCKED.

**⭐ OWNER LOOK, 2026-09-06, verbatim (A5):**
> *"there are empty patches, in the pants, and the shirt looks to baggy, and not a tighter
> fit, the stick is supposed to be above his waist in the front so he can pull it out, so it
> is the wrong way"*

All three checked against `zFt_0061.png` first-hand. **All three are real.**

### ✅ THE STICK — FIXED, and a recorded measurement was WRONG

Measured off the frame with a height grid, both figures normalised to their own bbox:

| | source | ours (before) | ours (now) |
|---|---:|---:|---:|
| grip tip, fraction of figure height | **0.385** | 0.444 | **0.409** |
| protrusion past the body | 0.27 of width | 0.17 | 0.17 |
| axis angle | ~40° | ~43° | ~43° |

The obi sits at 0.52–0.62, so the source's grip rides **well clear above the sash** — drawable,
exactly as the owner said. Ours sat at the gi's hem.

⛔ **`ogPose.ts`'s own note claimed the endpoints were MEASURED at (0.107, `0.426`).** The frame
says **0.385**. §0: the frame wins. Corrected in the same commit.

`OG_EQUIPMENT[3].y` −55 → **−59**, chosen on a four-point sweep, and **not** on the number that
best matches the traced frame:

```
world y      tracing    held-out    grip
  -55        0.9123      0.8566     0.444     (was)
  -59        0.9180      0.8654     0.409     <- SHIPS: both floors UP
  -62        0.9267      0.8509     0.383     exact grip, held-out DOWN 0.0145
  -65        0.9194      0.8426     0.357
```
**−62 lands the grip on the source's own 0.385 and costs the held-out grade** — the signature of
fitting to the single traced frame. −59 raises both, so −59 ships and the grip is 0.024 high.
Floors RAISED: tracing **0.9123 → 0.9179**, held-out **0.8566 → 0.8654**. Ink bounds unchanged —
this is placement, not silhouette. **Veto** = take −62 for the exact grip and give up the
generalisation grade.

⚠️ **The 0.17-vs-0.27 protrusion is NOT a defect.** The source fighter carries a **sword in a
scabbard**; ours carries the **training branch** — the game's own level-1 starting weapon, read
off the PLAYER screen. Owner ruled 2026-09-06: **"branch"**. Our stick's midpoint is 0.638
against the source's 0.625, so the placement is right and the 20 % shortfall is the weapon.

### ⛔ THE EMPTY PATCHES IN THE PANTS — CONFIRMED, CAUSE FOUND, FIX MEASURED AND REJECTED

Confirmed and located — background visible *through* the trousers at three places (fractions of
the figure): **y 0.64–0.67 × x 0.66–0.74**, **y 0.80–0.83 × x 0.82–0.92**, **y 0.97 × x 0.43–0.57**.
The source figure has **zero** enclosed background below the waist. Cause: 9011 is ONE traced
panel drawn at BOTH calf slots, at 23° and −3°; wherever the two instances fail to overlap you
see through.

**⭐ AND THE REASON THE SECOND PANEL WAS NEVER TRACED IS FALSE.** `traceGarment.py` carried a note
saying the far leg *"is not bounded by ink on its right, the outline there IS the scabbard, so
the region leaks"*. **RE-TESTED 2026-09-06: it closes cleanly.** `reject_occluder` cuts the saya
by hue (4430 px → 4106), bbox (842,784)-(901,892), 60 × 109 video px against the front panel's
63 × 113, and **four different seeds return the identical region** — which is what says it is
bounded rather than leaking. It was traced, re-authored, wired and measured.

**It was then REMOVED, because every way of drawing two panels costs more than the gap it closes:**

| slots 7 / 11 | tracing (floor 0.9179) | held-out (floor 0.8654) | A13-A worst (ratchet 12.78) |
|---|---:|---:|---:|
| `[9011] / [9011]` — **ships** | **0.9180** | **0.8654** | **12.78** |
| `[9011] / [9021]` | 0.9106 ⛔ | 0.8579 | 15.74 ⛔ |
| `[9011] / [9011, 9021]` | 0.9147 | 0.8624 | 16.89 ⛔ |
| `[9021, 9011] / [9021]` | 0.9148 | 0.8566 | 15.00 ⛔ |

The reason is **structural, not tuning: every extra panel is an extra closed black contour**, and
`hakama/ink` is already over the source. The OG draws **one** column with **one** outline and a
thin internal seam. Visually the two-panel render IS better — the panels meet with a single
clean seam — and it is inkier everywhere, which is the defect the ink budget was built to see.

⇒ **THE REAL FIX IS ONE SHAPE FOR THE WHOLE HAKAMA.** Attempted and **not viable yet**:
`outer_silhouette` over a white window floods to the crop edges (12,377 px of a 16,128 px crop)
because the dark grass at the hem joins the cloth to the background. It needs a hem-aware
boundary — real work, not a variant sweep. Everything needed to redo the back-panel trace in one
command is recorded in `traceGarment.py`'s note at the hakama entry.

### ⛔ THE BAGGY SHIRT — CONFIRMED, AND IT IS THE SAME BLOCKER AS THE WHITE COLUMN

The source's jacket has a **straight front edge and a clean horizontal hem**; ours **bells
outward** at the bottom into a scalloped skirt, wider at the hem than at the shoulders. That is
9015's silhouette, and 9015 is the shape that **cannot be regenerated** without reinstating the
SESSION 22 balloon (GATE A9-E 0.44 → 3.50 local px). Unchanged and still blocked.

---

## SESSION 32 — LANE L4a: the NPC roster and the AI dispatch table (2026-09-08)

### ⛔ `AI_TIERS` IS A HAND-AUTHORED STAND-IN, AND NOW THE REAL TABLE EXISTS BESIDE IT

`src/config/ai.ts` ships **three** tiers — `easy` / `normal` / `hard` — wired into
`DuelScene` and `EncounterScene`. `src/config/ogAi.ts` now records what the original
actually dispatches: **38** cases in `createNPC`, **13** values in `createRoomNPC`, **2** in
`createRoomNPCProcGen`, over a value space the data uses **34** distinct members of.

**`AI_TIERS` maps to NO OG `ai` value.** It is not a coarsening of the 38, not a subset, and
not a renaming: it is an authored difficulty curve with no counterpart in the payload. It
stands in for **none** of the 38 — the honest statement is that the original has no
difficulty tiers at all, it has one actor class per `ai` value and scales the fight through
`enemyModel.ts` instead.

**L4a does not rewire it, deliberately.** Replacing `AI_TIERS` with a real dispatch moves
`Sim.ts` and `tests/duel-baseline.test.ts`, which are `GAUNTLET.md` §4's no-touch list and
belong to **L5** by its atomic protocol (DIVERGENCES entry first, then the sim change, then
ONE re-record, all in one commit). Recording the divergence is L4a's job; closing it is not.

**Veto path:** none needed — nothing changed. When L5 does rewire it, this entry is the
"before".

### CONTRACT VALUES NOW HELD THAT WERE PREVIOUSLY UNHELD

- **495 NPC rows**, base `hp` / `attack` / `defense` / `lvl`, full 12-slot paperdoll, 647
  skill assignments, 131 loot rows with float drop chances. `OG_NPCS`, A2-cited to
  `npcdata.xml`, byte-checked by `tests/ogNpcData.test.ts`.
- **The `<ai>` → actor-class map**, all three dispatches, with constructor arguments.
  `OG_AI_*`, A2-cited to `NPCManager.as` and `XMLNpc.as`, byte-checked by
  `tests/ogAiData.test.ts`.
- **`OG_AI_DUEL_PLACEMENT`** (`NPCManager.as:643`) — the duellist's spawn geometry: x **650**
  facing left when `rightPos`, x **150** facing right otherwise, then `MCSActor.BOW2`.
  ⚠️ **RECORDED, NOT WIRED.** These are the first OG duel *coordinates* the repo holds, and
  using them moves `Sim.ts`. L5's, not L4a's.

### ⛔ A MEASUREMENT DOC CORRECTED BY THE SOURCE

`docs/sessions/L4A_KICKOFF.md` § SESSION 31 RECON, shape 5, illustrated "npc ids are neither
sorted nor contiguous" with *"807 sits between 197 and 201"*. Measured 2026-09-08 against
`npcdata.xml`: there is exactly **one** descent in the id sequence, at source index 209→210,
where the block **800..819** sits between id **199** and id **200**
(`…817, 818, 819, 200, 201, 202…`). The **claim** the illustration served — INDEX IS NOT ID —
is correct and unchanged; only its example was wrong. Corrected in the kickoff and pinned
with the measured neighbours in `tests/ogNpcData.test.ts`. Standing rule applied: when a
measurement doc and the source disagree, the source wins, and it is said out loud.

### WHAT IS DELIBERATELY NOT MODELLED

- **The 34 enemy behaviours.** `ogAi.ts` names the classes; it does not implement them. L4b.
- **`<earth>` (3 rows) and `<fire>` (1 row), both value 10.** Recorded on the row, no
  meaning attached — the elements belong to L11.
- **`<prop1>` = 1 or 2 on ~50 rows, and `<armor|head|pants>` = 2 or 10 on npcs 75 and 78.**
  None is an item id (checked against the committed 982 `OG_ITEMS`). `MCSCharacter.as:1229-1249`
  falls back to `prop13000` (the default scabbard art) when an id has no symbol, so they
  degrade gracefully rather than crashing. Recorded verbatim, no meaning attached.
- **Which randomness picks a paperdoll.** `processString` (`MCSCharacter.as:573-578`) uses
  **`Math.random()`**; `XMLNpc.as:561` uses the **seeded `rng.rand()`** for the same kind of
  choice. Two different sources for one decision. It matters the day paperdolls have to be
  reproducible under our injected mulberry32 RNG — recorded now so that day is not a surprise.

## LANE L4b (slice 0) — THE NPC BASE IS PORTED BEHIND THE EXISTING SEAM. TWO KICKOFF NUMBERS CORRECTED BY THE SOURCE, AND THE SEAM'S LIMITS ARE NOW A LIST (2026-09-09)

**What landed.** `src/core/npc/` — `MCSActor.ts` (the parent, `MCSActor.as` minus its
tables), `Npc.ts` (`NPC.as`, all 51 functions by name, in source order, each under its
line), `NpcDamage.ts` (`Damage.as`), `NpcController.ts` (the seam adapter) and `types.ts`
(the four ports). `src/config/ogActor.ts` — 429 anim keys, 64 state ids, 22 part ids and
10 launch types, GENERATED by `scripts/payload/transcribeActorConsts.py` and byte-checked.
`src/config/ogNpcBase.ts` — every `NPC.as` number, CONTRACT, cited. `OG_FPS = 24` in
`timing.ts`. Four test files, **+95 tests** (1113 → 1208), all red-proofed and six guards
chaos-planted.

### ⛔ TWO MEASUREMENT-DOC CORRECTIONS — the source wins, said out loud

1. **`class MCSPlayer extends NPC`** (`MCSPlayer.as:3`). `L4B_KICKOFF.md` drew
   `MCSPlayer` as a *sibling root* of `NPC` ("A DIFFERENT SUBSYSTEM"). It is a
   **descendant**: the player is an `NPC`. The scope cut stands unchanged — `EnemyPlayer`
   is still 1,647 lines over 4,775 of player — but the base built in this slice is now
   ALSO the player's base, and L5 inherits it rather than building a second one.
   Pinned in `tests/npcTree.test.ts`.
2. **The override vocabulary is 22, not 31, over the in-scope tree.** Trap 3 of the
   kickoff says "31 distinct methods across the tree". Measured against the AS3: **22**
   over the 34 in-scope descendants, **31** over all 39 classes — the nine extra names
   (`AI`, `createLoot`, `getDamage`, `getSkillLevel`, `getTargetPosition`, `gotDeathTouch`,
   `gotInput`, `gotNetworkDamage`, `rewardXP`) all belong to the out-of-scope
   `EnemyPlayer` branch. Both numbers are pinned; the kickoff's claim was measured over
   the wrong set. The traps it illustrates (`EnemyVegePatch` 10 / `EnemyWolf2` 1) are
   correct and are also pinned.

### ⚠️ THREE THINGS PORTED AS THEY BEHAVE, NOT AS THEY READ

- **`gotLaunched()`'s downed guard is dead code** (`NPC.as:538`):
  `this.isDowned() && !actionState == FLY_STATE` parses as `(!actionState) == 32`, always
  false. A downed body CAN be re-launched through `gotLaunched()`; the only thing stopping
  it in practice is `gotHit`'s own `!isDowned()` (`:473`). Ported as it behaves, and that
  guard has its own test so a "cleanup" cannot drop it.
- **`gotFlyAway(target.x, …)` compares a part's LOCAL x with the body's SCREEN x**
  (`NPC.as:482`, `:624`). Ported through `HitGeometry.partX`, so the render side gives the
  coordinate the source actually used; no smoothing.
- **`StatsManager.multiplier`** (`MCSActor.as:1060`/`:1065`) — hp stored × a random 2..6
  and ÷ on read, an anti-memory-editor obfuscation with no gameplay effect. Not modelled.

### ⛔ WHAT THE SEAM CANNOT CARRY — the input to L5 (gate L4b-F)

`OpponentController.ts` is unchanged (gate L4b-B). An `Npc` fills it through
`NpcController`, which steps the actor at 24 Hz inside the 60 Hz tick, takes x from the
Sim's view every tick, and emits `moveX` (the SIGN of the actor's own step, held between
steps), `strike` (the actor's `target.checkHitObject` swing) and a `telegraph` on entering
`ATTACK_STATE`. Everything below is what the seam has no channel for. **None of it is a
licence to widen the seam in L4b** — it is the list L5 rules on.

1. **Inbound hits never reach the actor.** The Sim resolves the player's slash with its
   own `core/damage.ts` model and its own hp; nothing calls `Npc.gotHit(part, damage)`.
   The whole reception side — defence, floors, behead, elements, the seven reactions — is
   built and tested but unreachable from a fight. L5 must either route the slash into
   `gotHit` (needs a real `HitGeometry` off the skeleton) or rule that the Sim's model
   stays and the actor's hp is display-only. A ruling, not a default.
   **RULING (decide-and-flag, owner delegated 2026-09-09): L5 routes the resolved hit
   INTO `Npc.gotHit(part, NpcDamage)` and the actor's hp is authoritative for NPC-class
   actors.** Why: the reception rules — defence subtract, attacker-level floor, behead
   ×1.5, elements, the seven reactions — ARE the 34 behaviours; keeping a second damage
   model for them is the `AI_TIERS` mistake again. `enemyModel.ts` stays the DUELLIST's
   (`EnemyPlayer.as:82`), untouched. Red-team: it commits L5 to a coarse part geometry
   (head band / body / weapon zone off the fighter's box) before the skeleton gives a real
   one, and it changes nothing in the 1v1 duel, whose enemy is `EnemyPlayer`. Veto = keep
   the Sim's model; the actor's hp becomes display-only and `gotHit` is called with its
   result ignored.
2. **The actor's y and its reaction states are invisible to the Sim.** The Sim only ever
   moves an enemy's x; `GOTLAUNCHED`/`FLY`/`DOWNED`/`KNOCKDOWNED`/`STUN`/`VICTIM` and the
   arc physics happen inside the actor. The seam would need an outbound position/state,
   or the Sim reads the actor directly.
3. **Speed.** `moveX` is a direction; the Sim moves at `ENEMY_SPEED` (141.7 world px/s).
   An `EnemyKatana` walks at `random() * 3 + 4` px per 24-fps frame = 96–144 px/s. The
   seam would need a per-tick `dx` (or a per-controller speed) to be exact.
4. **Hit frames.** The source lands a swing on the frames its weapon part OVERLAPS the
   target; the proxy turns the first `checkHitObject` call of a step into one `strike`,
   and the Sim applies its own range/evasion. Exact hit timing needs geometry (item 1).
5. **Presentation events have no seam channel** — floating damage numbers, loot
   projectiles, loot/XP payouts, the chosen death clip, flying hat/weapon, disposal. They
   are on `npc.events`; a scene drains them directly. That is a scene-side read, not a
   seam change.
6. **Nothing on the NPC tree switches stance or throws a kunai** — those are the
   duellist's (`EnemyPlayer`, L5). `switchStance`/`throwKunai` are never emitted.
7. **Randomness is seeded everywhere** (`rng` injected). The source's `createLoot` and
   `die` use unseeded `Math.random()`, so there was no sequence to preserve; the four
   blood-placement dice (`:941`, `:983`, `:1032`, `:1054`) are not rolled at all — they
   only place particles — and the `death` event carries the roll that chose the clip.

### WHAT IS DELIBERATELY NOT MODELLED

- **Blood-emitter angles, velocities and counts** in `die()` (`NPC.as:920-1090`): render.
- **The paperdoll and its part clips**: `initMCSFromXML` records the roster's `<mcs>`;
  drawing it is L6's, and the per-part hit test is the `HitGeometry` port.
- **`setDisplayName`, the ColorCode filter maths** (a `filter` field records which one).
- **`getMCS()`** — the display object is folded into the actor; the one `MCSActor.as`
  function with no TS twin, named as such in `tests/npcTree.test.ts`.

### ⛔ NOT DONE — L4b-I, restated at slice level

Slices 1–6 (the 34 descendants) are open; the base is frozen and green, so they may now
proceed cheapest-first. `EnemyPlayer`'s branch, `CutsceneActor`, the `AI_TIERS` rewire,
the fight-feel grade: not built, not attempted, not claimed.

## LANE L4b (slice 1) — THE FIVE PATTERN-SETTERS ARE PORTED. THREE SOURCE QUIRKS PORTED AS THEY READ, AND ONE FINDING ADDED (2026-09-09)

**What landed.** `EnemyKatana` (ai 3), `EnemyKnife` (ai 1 and the absent-`<ai>` default),
`EnemySpear` (ai 4), `RoomGoblin` (room ai 22), `RoomOgre` (room ai 23) — each overriding
exactly `update` / `startAction` / `doAction`, each written out in full from its `.as`
file (the kickoff forbids flattening; the per-class gaps are behaviour). Numbers in
`config/ogEnemyKatana.ts`, `ogEnemyKnife.ts`, `ogEnemySpear.ts`, `ogRoomNpc.ts`, and
`ogNpcHumanoid.ts` for the six numbers the humanoid `update()` switch repeats verbatim
(each twin's line named). **+35 tests** (1208 → 1243); six guards chaos-planted, and one
plant that stayed GREEN (the katana's 100 px range) exposed a missing exact-boundary pin,
now added for all three ranges.

### THE PORTS GREW BY FOUR FACTS — read-only, no seam change

`NpcWorld` gained `cutsceneShowing`, `transitioning`, `noAggro` (the three aggro guards of
`spotPlayer`, `RoomGoblin.as:276-280`) and `npcBlocked(x, facingRight)`
(`GameStage.isNPCBlocked`, room furniture within 50 px in the walk direction). `NpcTarget`
gained `isDowned()` — knife, spear, goblin and ogre stab a downed target for double.

### ⚠️ THREE THINGS PORTED AS THEY READ

- **The katana's vertical melee tolerance is 10 px facing LEFT and 50 px facing RIGHT**
  (`EnemyKatana.as:176` / `:185`); the spear's charge trigger has the same asymmetry
  (`EnemySpear.as:192` / `:204`). Ported and pinned, not "fixed".
- **`RoomGoblin`'s fidget roll is `int(Math.random() * 2 == 1)`** (`:168`): the product is
  compared with 1 BEFORE the int, so the branch fires only when `random()` returns exactly
  0.5 — never, in practice. Ported as it reads; pinned both ways (0.5 fires, 0.49 does not).
- **In-frame re-entry.** `update()` runs the clip-end switch BEFORE `doAction()`, so a
  finished attack clip ends into WALK and, still in range, WALK re-enters ATTACK (or STAB)
  in the SAME frame; IDLE after a get-up lasts zero frames. A 3-frame attack clip therefore
  swings on 2 frames. Pinned, because a "cleaner" ordering would change the swing rate.

### ⚠️ ONE QUIRK DROPPED AS DEAD CODE

`spotPlayer` re-checks `isTransitioning()` after already returning on it two lines
earlier (`RoomGoblin.as:296`, `RoomOgre.as:326`). Same frame, same value: the second check
is unreachable and is not ported. Lint would have flagged it; the behaviour is identical.

### THE SEAM FINDINGS — one added

**8. The player's downed state is invisible to the actor.** `OpponentView` has
`playerJumping` but nothing for downed/knocked-down, so the proxy answers `isDowned()`
with `false` and no actor will ever DOWNSTAB the player through the seam. The player's
own actor (L5) has the state; the seam needs a `playerDowned` for the knife/spear/goblin/
ogre stab to exist in a fight.

**Finding 4, made concrete.** `EnemyKatana` tests its weapon on EVERY attack frame
(`:196`); the source rate-limits that on the RECEIVER (`NPC.gotHit` refuses inside the
twelve-frame `gotHitCounter`, `:387`/`:462`). The proxy now carries that same guard, so
one strike reaches the Sim per twelve actor steps — the source's own rate, not a flood.

### ⛔ NOT DONE — L4b-I at slice level

Slices 2–6 (29 descendants). `EnemyPlayer`'s branch, `CutsceneActor`, the `AI_TIERS`
rewire, the fight-feel grade: not built, not attempted, not claimed.

## LANE L4b (slice 2a) — THE WOLVES AND THE CIVILIANS: THE FIRST RECEPTION-SIDE OVERRIDES, PORTED AS FULL BODIES. ONE FINDING ADDED, ONE KICKOFF COUNT MOVED TO 2b (2026-09-10)

**What landed.** `EnemyWolf` (ai 8) → `EnemyWolf2` (ai 10), `EnemyFox` (ai 24);
`EnemyCivilian` (ai 7, the room dispatches' fallback) → `EnemyCivilianFemale` (ai 33),
`EnemyCivilianOld` (ai 32) — six classes, 1,645 AS3 lines, each written out in full under
its cites with `override` on exactly the AS3's set. Numbers in `config/ogEnemyWolf.ts`,
`ogEnemyFox.ts`, `ogEnemyCivilian.ts`, `ogEnemyCivilianFemale.ts`, `ogEnemyCivilianOld.ts`;
the civilian twin lines added to `ogNpcHumanoid.ts`; `EnemyWolf2` has no number of its own
and imports the wolf's (twins named). **+56 tests** (1243 → 1299); eight guards
chaos-planted red and restored `cmp`-identical.

### THE PORTS GREW BY ONE READ AND TWO EVENTS — no seam change

`NpcWorld.adventureMode` (`GameEngine.isAdventureMode()`, ten uses: the wolf and fox do
not bite or land pounce hits in the overworld, run at 12 not 15, and the fox flees and
sings there). `NpcEvent` gained `speech { table: 'lang' | 'fox', id }` — the civilian's
alert is a `LangManager` id (410–414), the fox's line is an INDEX — and `speechClear`
(`mcs.setSpeechText("")`). `Npc.emitDeath` became `protected` and `NO_DICE` is exported,
so a descendant that owns its `die()` reports the death clip through the same event.
No adapter builds an `NpcWorld` yet (three test harnesses do), so `adventureMode`'s
answer in a fight is L5's to give; the duel is a room, so `false`.

### ⛔ A KICKOFF COUNT MOVED — measured per file

`L4B_SLICE2_KICKOFF.md` lists `NPCManager.externalRedFreezeCheck()` (9) and
`StageManager.isPeaceful()` (1) among "the ports these ten will need". Grepped per file:
the nine are `EnemySpearElite.as` (8) + `FriendlyArcher.as` (1); the one is
`EnemySpearElite.as`. **Neither touches 2a.** The kickoff is annotated; 2b ports both.

### ⚠️ PORTED AS THEY READ — the wolf against the base

`EnemyWolf.as` overrides `gotHit` (`:343`), `doLaunched` (`:429`), `die` (`:447`) and
`redFreeze` (`:471`), and each is its own body. Pinned in `tests/npcSlice2a.test.ts`:

- **A WEAPON hit doubles and beheads** (`:373-378`) where `NPC.as:410` deflects it — the
  wolf has no weapon to parry with; `PART_weapon` is a body part on `MCSWolf`.
- **Elements are clamped at zero and never defended** (`:355-370`); the base subtracts
  `STAT_*DEF` with a floor of 1.
- **Defence and the floor apply BEFORE the alive check** (`:383-387`); invisible in play,
  kept in the order the source has it.
- **Only launch and knock-down react** (`:395-402`): no fly, groin, back-throw or stun
  branch, and `behead` / `stunCounter` are never reset — a wolf that survives a head hit
  stays `behead = true` until `reset()`.
- **`die()` pays loot and XP even in playback** (`:450-451` has no `isPlayback` /
  `dontGiveLoot` guard) and rolls no dice: one clip, `WOLF_DEATH`, no face flip.
- **`doLaunched` has no peak clip and no `velY > 0` landing guard** (`:435`), and does
  not hide the bar; **`redFreeze` spares CHARGING and freezes FLY** (`:482`) — the base
  spares FLY.

### ⚠️ PORTED AS THEY READ — the rest

- **The fox flees before it bites.** In WALK, `checkPlayer()` (`EnemyFox.as:115`) runs
  BEFORE the bite band (`:116-127`); at 75 px in the overworld it runs, in a room it runs
  AND bites in the same frame (RUN then ATTACK). Pinned both ways.
- **Civilians end ENEMYLAND into DOWNED** (`EnemyCivilian.as:61-63`); every fighter so
  far ends it into WALK.
- **`EnemyCivilian.spotPlayer` sets `onAlert` BEFORE the transition check** (`:312-327`),
  unlike `RoomGoblin`'s up-front guards: the alert sticks, the run and the line wait for
  the fade, and from IDLE it is never re-checked (`!onAlert && doChase`). No `noAggro`
  or cutscene guard exists here.
- **`EnemyCivilianOld.update()` is byte-identical to its parent's** (`:20-104` ↔
  `EnemyCivilian.as:41-125`): an override that changes nothing, written out because the
  tree test demands the override set and the source has it.
- **`walkSpeed` is an AS3 `int`** (`NPC.as:12`): the wolf's "half speed backwards"
  (`:153`) truncates (5 → 2), and the edge bounce's `velX *= 2` is an int product.

### ⚠️ DEAD CODE DROPPED

`EnemyWolf.update`'s finished-clip switch lists `WOLF_LAUNCHEDEND` twice (`:67`, `:114`)
and `WOLF_DOWNEDTOIDLE` twice in one case group (`:91`, `:94`). The first match wins;
the repeats are unreachable and not ported.

### WHAT IS DELIBERATELY NOT MODELLED

- **The fox's nine speech lines** (`EnemyFox.as:62-94`) are quoted lyrics from a
  third-party song. The permission ruling (`docs/OWNER_PERMISSION_RULING.md`) covers
  Lut's art and code, not that; the strings stay OUT of the repo. Core emits the d9
  index (`speech`, table `fox`); the render layer owns the text. Veto = put the strings
  in the render layer, never in `src/core/` or `src/config/`.
- **`MCSWolf`** (`:15`) — a different display class with four legs; the paperdoll stays
  the roster's and the clips are `OG_ANIM.WOLF_*`. **`changeScale(1.2, 1.2)`** (`:27`)
  keeps the facing sign; the port keeps facing and scale apart, so `setScale(1.2)`.

### THE SEAM FINDINGS — one added

**9. The pounce strikes untelegraphed.** `NpcController` emits a `telegraph` on entering
`ATTACK_STATE` only. The wolf's pounce lands its hits from `CHARGING_STATE`
(`EnemyWolf.as:299-316`, head and right hand on every airborne frame), so through the
seam a pounce is a `strike` with no warning. L5 needs the telegraph to fire for CHARGING
too (or on `WOLF_POUNCE_START`), with the clip's length.
**RULING (decide-and-flag, 2026-09-10): the telegraph fires on ENTERING `CHARGING_STATE`,
its length = the `WOLF_POUNCE_START` clip's, because that wind-up is the warning the
player actually sees — the hits come from the mid clips that follow it.** Red-team: the
rejected option (telegraph on the mid clip) warns later and shorter; my pick breaks if
the pounce-start clip is only a frame or two at 24 fps (an 80 ms warning, shorter than
the katana's), and it secretly depends on L5 reading the clip table for a CHARGING entry
the way `NpcController` reads it for ATTACK today. Veto = telegraph on `WOLF_POUNCE_MID`
/ `MIDHIGH` start instead; one line in the adapter either way. Findings 2 and 3 made concrete:
the pounce moves the body 15 px per frame (the Sim will move it at `ENEMY_SPEED`), and
the fox parks itself in `REDFREEZE_STATE` off-stage (`EnemyFox.as:149`) — a state the Sim
cannot see.

### ⛔ NOT DONE — L4b-I at slice level

Slice 2b (`EnemyArcher` → `FriendlyArcher`, `EnemySpearElite` → `FriendlySpearElite`) and
slices 3–6 (19 more descendants). `EnemyPlayer`'s branch, `CutsceneActor`, the `AI_TIERS`
rewire, the fight-feel grade: not built, not attempted, not claimed.

## LANE L4b (slice 2b) — THE ARCHERS AND THE SPEAR ELITES: THE FIRST FRIENDLIES, THE FIRST BOSS BALANCE, THE ARROW. TWO FINDINGS ADDED (2026-09-10)

**What landed.** `EnemyArcher` (ai 2) → `FriendlyArcher` (ai 34); `EnemySpearElite` (ai 28,
and ai 37 as the boss) → `FriendlySpearElite` (ai 31) — four classes, 1,041 AS3 lines,
each written out in full with `override` on exactly the AS3's set. Numbers in
`config/ogEnemyArcher.ts`, `ogEnemySpearElite.ts` and `ogNpcFriendly.ts` (what the two
friendlies share, byte-identical bodies); the archer / elite twin lines added to
`ogNpcHumanoid.ts`. **+40 tests** (1299 → 1339); seven guards chaos-planted red and
restored `cmp`-identical.

### THE PORTS GREW BY FOUR READS, ONE TARGET QUESTION, ONE SHAPE FLAG AND THREE EVENTS — no seam change

`NpcWorld`: `playerStats { maxHp, defense, minDamage, damageRange }` (the PLAYER's live
stats, bonuses summed — `StatsManager.getPlayerStats + findBonusStat`, `getMinDamage`,
`getDamageRange`), `peaceful` (`StageManager.isPeaceful`), `duelMode`
(`GameEngine.isDuelMode`), `externalRedFreezeCheck()` (`NPCManager.as:1651`, a callback).
`NpcTarget.isAirborne()` — the proxy answers `OpponentView.playerJumping`, the one
reaction state the seam does carry. `HitShape.breakable?` (`Projectile.canBreak`).
`NpcEvent`: `arrow { x, y, velX, velY, damage, canLaunch }`, `setProp { itemId }`,
`breakProjectile`. **No adapter builds an `NpcWorld` yet**; the five reads and the
callback are L5's to wire.

### ⚠️ PORTED AS THEY READ

- **The friendlies are built from the PLAYER** (`FriendlyArcher.as:21-34`,
  `FriendlySpearElite.as:19-32`): damage / defense / maxhp = 0.75 × the player's, xp 0,
  `level = StatsManager.getLevel()` on `init` — the roster row supplies only the paperdoll,
  the elements and the loot. Every stat is an AS3 `int`: `playerATK = minDamage +
  damageRange / 2` truncates once, then each `× 0.75` truncates again.
- **The boss balance** (`EnemySpearElite.as:51-129`): scaled like the base, `xp = lvl·5+45`,
  then hp raised to survive `10 + lvldiff` player hits (floor 3) and damage raised to kill
  in `18 − lvldiff` (floor 1). **The player's-hit floor is an if / else-if chain that FALLS
  THROUGH** (`:95-110`): a hit that clears its own tier's `lvl/8` or `lvl/6` is still
  tested against `lvl/4`. At player level 20 a hit of 3 becomes 5, not 3. A plant that
  flattened it to `max(hit, ladder)` went red. The second scaling block (`:71-78`) runs
  with `factor = 1` and is kept — it costs the int products.
- **`AI()` arms `spearSpinCoolDown` for all three specials** (`:541`, `:547`, `:553`);
  `spearFlurryCoolDown` and `spearLaunchCoolDown` are declared, decremented (`:277-284`)
  and never set. Pinned: flurry and launch leave their own cooldowns at 0.
- **The elite never returns early on a missing target** (`:139-142`): `AI()` runs every
  frame while there is none (`:331`), and WALK with none idles (`:344-348`).
- **The archer's knife lands ONCE, when its clip ends** (`EnemyArcher.as:119-121`), then
  WALK — whose fresh `destX` may be where it stands, so it reloads in the same frame.
  `update()` has no re-target trigger; only AIM re-targets (`:212-214`).
- **A shot at a target straight above leaves at (0, 0)**: `fireArrow` divides `|dx|` by
  `velXa`, both 0 → NaN through the whole solve, and `createArrow`'s `int` parameters read
  NaN as 0 (`:277-281`, `:300`). Ported as it reads, through `asInt`.
- **`FriendlyArcher.checkHitObject` continues past a refused part** (`:66-80` has no
  `return false`), where `NPC.as:323` and the elite stop. `HitGeometry.partHitBy` answers
  ONE part, so a refused bow hit ends the scan here too. The only case that differs — a
  slash overlapping the bow AND the body — needs the multi-part geometry L5 will build.

### ⚠️ DEAD CODE DROPPED

`EnemySpearElite.setLevel`: `namecolor` (`:63`, written, never read) and the `else` at
`:65-68` (`xp = lvl * 2 + 20`, unreachable inside `isBoss`).

### WHAT IS DELIBERATELY NOT MODELLED

- **`mcs.setDisplayName(name, 0xFFCC00)`** (`FriendlyArcher.as:57`, `FriendlySpearElite.as:55`)
  — the gold nameplate of a friendly; render-side, as every `setDisplayName` is.
- **`mcs.setProp(13000)`** on the archer's death (`:307`) is a `setProp` event; which clip
  item 13000 is (`ogItems.ts`: type 9, a prop) is the render layer's.

### THE SEAM FINDINGS — two added

**10. The arrow has no seam channel.** `ProjectileManager.createArrow(x, y, vx, vy,
damage, canLaunch, owner)` (`EnemyArcher.as:300`) is an `arrow` event on `npc.events`.
`OpponentIntent` has `throwKunai` — the DUELLIST's straight throw at the player's current
position — and nothing for a ballistic shot with its own velocity, gravity (`Projectile.as:8`
= 3) and launch flag. L5 needs a projectile intent or a scene-side drain of the event; until
then an archer through the seam only ever knifes.

**11. A friendly through the seam would attack the player.** `NpcController` hands every
actor the PLAYER proxy as its target and answers `nearestEnemy` with it. `FriendlyArcher`
and `FriendlySpearElite` hunt with `isEnemy = false` (`NPC.as:262`, `EnemyArcher.as:29`)
— they need an ENEMY actor, and the seam has one enemy slot per controller and no way to
hand an actor another actor. The friendlies are ported and tested; they cannot be fielded
until L5 gives the world a real `nearestEnemy`.

### ⛔ NOT DONE — L4b-I at slice level

Slices 3–6 (19 descendants, none with children). `EnemyPlayer`'s branch, `CutsceneActor`,
the `AI_TIERS` rewire, the fight-feel grade: not built, not attempted, not claimed.

## LANE L4b (slice 3a) — THE FOUR WANDERERS: FOUR ANIMALS THAT LOOK LIKE ONE AND ARE NOT. TWO FINDINGS ADDED, ONE SOURCE BUG PORTED AS IT READS (2026-09-12)

**What landed.** `EnemyBear` (ai 17), `EnemyDeer` (ai 19), `EnemyHorse` (ai 12),
`EnemyStag` (ai 21) — four classes, 1,148 AS3 lines, none with children, each written
out in full under its cites with `override` on exactly the AS3's set — **19 ported NPC
classes, i.e. 21 `SHIPPED` entries** (the map also holds `MCSActor` and `NPC`, which are
not ports). Numbers in `config/ogEnemyBear.ts`, `ogEnemyDeer.ts`, `ogEnemyHorse.ts`,
`ogEnemyStag.ts` and a new `ogNpcAnimal.ts` for what all four share, every twin line
named. **+57 tests** (1339 → 1396); **eighteen guards chaos-planted red** and restored
`cmp`-identical. **No seam change at all** — `types.ts` is untouched, every port these
four need already existed.

**Two of the eighteen plants STAYED GREEN on the first pass and were not argued away:**
the deer's missing target re-acquire (the test only ever used a LIVE target, so a planted
re-acquire never fired) and the stag's charge speed (the test drove only one of the two
direction branches). Both tests were re-authored to cover the uncovered branch, and both
plants then went red. A third gap — nothing pinned that these constructors do NOT act,
where the wolf's does — came out of the adversarial measurement pass, as did the elemental
column finding below.

### ⚠️ PORTED AS THEY READ — the four against each other

They share a skeleton and agree on almost nothing inside it. Each of these is pinned in
`tests/npcSlice3a.test.ts` because a porter copying one onto another would ship a bug:

- **Only the bear's `idleCounter` ticks outside IDLE** (`EnemyBear.as:163-166`, at the TOP
  of `doAction`, guarded `> 0`). It has to: the counter doubles as the attack cooldown
  (`:200`, `5 * 24`) and has to run down while the bear is GALLOPING. The deer, horse and
  stag tick it inside the IDLE case only (`:135` / `:149` / `:209`) and unguarded, but
  re-arm it at 24 on the same frame it reaches `<= 0` (`EnemyDeer.as:136-138`,
  `EnemyHorse.as:150-152`, `EnemyStag.as:210-212`), so none of the four ever holds a
  negative count — the bear's `> 0` guard is what parks ITS counter at zero outside IDLE.
- **The cooldown is TICKED BEFORE IT IS CHECKED.** A bear entering `doAction` with
  `idleCounter == 1` ticks to 0 and then passes `idleCounter <= 0` on the SAME frame.
- **The bear swings with no `isAdventureMode()` fence** (`:212-214`) where the wolf's bite
  (`EnemyWolf.as:294`) and pounce (`EnemyWolf.as:310`) each have one. A bear mauls in the overworld.
- **The bear's ATTACK faces with its own comparison** (`:148-155`, `mcs.x < target.mcs.x`
  → faceRight) which DISAGREES with the base's `faceTarget()` (`NPC.as:1205`,
  `target.x < this.x` → faceLeft) at exactly equal x. Reusing `faceTarget()` there is a
  chaos plant that goes red.
- **The deer never re-acquires — and neither does the horse.** The deer's `update()`
  (`:42-69`) has neither the `target == null || target.isDead()` block nor
  `checkAITrigger()`; it keeps a dead target forever. The bear (`EnemyBear.as:55-62`,
  `:84-87`) and stag (`EnemyStag.as:78-85`, `:114-117`) have both; the horse's `update()`
  (`EnemyHorse.as:47-74`) has neither, but the horse never reads its target unless chasing.
- **Only the deer has a behind-the-back band** (`:219`/`:234`): 200 px when it is LOOKING
  at the player, 50 px when its back is turned (`&&` binds before `||`). And where a
  fleeing bear always aims off-stage, a fleeing deer only does so in the OVERWORLD — in a
  room it bolts to a random x (`:227`/`:242`).
- **An un-chased horse does nothing at all.** Its idle act-roll is fenced
  `!isShowing() && this.doChase` with an `else` that re-enters IDLE (`EnemyHorse.as:153`, `:166-169`),
  and its `checkPlayer()` returns on its first line unless chasing (`:232-235`) — the only
  one of the four with that guard. The stag's same act-roll has NO `doChase` fence and no
  `else` (`EnemyStag.as:213`), so an un-chased stag still wanders.
- **The horse's `init` neither grounds the body nor flips `doChase`** (`EnemyHorse.as:31-45`);
  the bear (`EnemyBear.as:42-46`) and stag (`EnemyStag.as:41-45`) do both.
- **The stag's off-stage red-freeze carries an extra `!this.doChase`** (`:256`) that the
  other three lack — a chasing stag runs off the edge and keeps going.
- **The stag's charge does not step down in the overworld.** RUN reads `isAdventureMode()`
  per direction (15 in a room, 12 outside — `:162`/`:174`); CHARGING is a flat 15 both
  ways (`:190`/`:195`), and it gores with `PART_head` at `LAUNCH_KNOCKDOWN` on EVERY frame
  (`:265-272`), with no adventure fence.
- **None of the four acts in its constructor.** The wolf's calls `startAction(IDLE_STATE)`
  (`EnemyWolf.as:16`) and is already snarling on a 24-frame timer; all four of these set
  only their `canGot*` flags, so a fresh one has no animation and `idleCounter == 0`.
- **`init()` therefore enters IDLE TWICE and rolls the idle die twice** — once inside
  `reset()` (`NPC.as:204`) and once on its own line (`EnemyBear.as:40`, `EnemyDeer.as:37`,
  `EnemyHorse.as:43`, `EnemyStag.as:39`). Pinned as an exact rng call count, because a
  test that mis-counts the rolls picks the wrong `seq` and silently tests the wrong branch.
- **None of the four loads the roster's elemental columns.** `NPC.init` assigns all eight
  `STAT_*` fields from `<fire>` / `<earth>` (`NPC.as:229-236`); not one of these four
  `init` bodies assigns any of them, and none of the four overrides `gotHit` — so they all
  run the BASE's, which subtracts `STAT_*DEF` values that are permanently zero. **An
  animal has no elemental defence and no elemental attack, ever**, however the roster row
  is filled in. Pinned on a row that really does carry `fire` and `earth`.
- **All four `die()` bodies are the same and none of them is the wolf's or the base's**:
  loot, XP, ground the body, DYING, the death clip, `dead`, hide the bar — **no
  `SoundManager.playDie()`** (`NPC.as:903`), no `isPlayback` / `dontGiveLoot` guard
  (`:904`), no facing coin (`:966`) and no death-clip roll (`:1005` / `:1096`), so the
  only rng an animal's death draws is `createLoot`'s — none at all with an empty reward
  list. They also drop the base's launch and downed branches, which
  cannot matter: all four set every `canGot*` flag false, so none is ever launched or
  downed. In-game only the PLAYBACK half of the missing guard is observable — `dontGiveLoot`
  is only ever set by `CutsceneActor`, `EnemyClone`, `EnemyPlayer` and `MCSPlayer`, each on
  itself.

### ⚠️ A SOURCE BUG, PORTED AS IT READS — and why it never bit

**`EnemyStag`'s constructor takes `doChase` and never assigns it** (`EnemyStag.as:12-28`).
The bear (`EnemyBear.as:23`) and horse (`EnemyHorse.as:23`) both have `this.doChase = doChase`;
the stag's line is simply absent, and the field is declared with no initialiser
(`EnemyStag.as:10`). Ported as `_doChase`,
discarded with `void` the way `MCSActor.setPose` discards `animName`, and pinned.

**It never bit because no dispatch ever passes it one.** `NPCManager.as`'s main switch
builds `new EnemyStag()` at `:582` with no arguments, and the ROOM dispatch (`:684-735`,
twelve `xml.ai` arms and an `else`) has animal arms for ai 12, 17, 18 and 19 — horse, bear,
boar, deer — and **no arm for ai 21 at all**: an ai-21 row there falls to the `else` and
builds an `EnemyCivilian` (`:734`). `config/ogAi.ts` already encodes exactly that (`:107`
main; no ai-21 room row, and the room fallback is the civilian, `:147`), from L4a. So the dropped argument is unreachable, not merely harmless: the stag's
chase flag can only ever be set by `init()`'s `!isAdventureMode()` branch.

**`EnemyStag.setLevel` (`:48-70`) is a hand copy of `NPC.as:239-260`** that differs in
NOTHING but decompiler artifacts — a split `var factor:Number = NaN;` declaration and
`this.` prefixes on fields. Written out because the tree gate demands the source's
override set, exactly like `EnemyCivilianOld.update()`. It needs no number of its own.
Reward included: `init` sets the animal curve (`:37`, `lvl * 5 + 45`) and `setLevel`
overwrites it with the base curve (`:62`, `lvl * 2 + 20`) — but the bear, deer and horse
override no `setLevel` and inherit the base's (`NPC.as:252`), which does exactly the same.
So **ANY levelled animal pays less XP than an unlevelled one**; the stag is not special.
Pinned (the stag's `setLevel` against the deer's inherited one).

### ⚠️ DEAD CODE DROPPED

`EnemyHorse.as:34-36` is an empty `if` on `xml.mcs.prop.toString` — no call parens, so a
Function object compared against `""`, and the body is empty either way. Not ported;
recorded in the class header.

### WHAT IS DELIBERATELY NOT MODELLED

- **`MCSBear` / `MCSDeer` / `MCSHorse`** (`:17` / `:15` / `:17`) — display classes with
  four legs. The paperdoll stays the roster's and the clips are `OG_ANIM.BEAR_*` (7),
  `DEER_*` (8), `HORSE_*` (7) and `STAG_CHARGE`, all already in `ogActor.ts`. The stag
  rides `MCSHorse` and uses the horse's clips throughout — which is why `OG_STAG.idle`
  IMPORTS `OG_HORSE.idle` rather than copying it.

### THE SEAM FINDINGS — two added

**12. The stag would be telegraphed TWICE under finding 9's ruling.** Finding 9 rules that
the telegraph fires on entering `CHARGING_STATE` (the wolf's pounce lands its hits from
there, so ATTACK-only telegraphing warns nobody). The stag reaches the same state by a
different road: `checkPlayer` → `ATTACK_STATE` + `HORSE_REARING` (`:305`/`:319`), the rear
clip ending → `CHARGING_STATE` (`:98-108`), then the gore. `NpcController` already
telegraphs on entering ATTACK, so under finding 9 the stag emits a telegraph for the rear
AND a second one for the charge — one attack, two warnings. L5 must either suppress the
CHARGING telegraph when the actor entered it FROM `ATTACK_STATE`, or telegraph CHARGING
only for actors that reach it without passing through ATTACK. **RULING (decide-and-flag):
suppress the second — the rear IS the warning the player sees, and it is already the
longer of the two clips.** Red-team: the rejected option (telegraph only CHARGING, never
ATTACK) is simpler and fixes wolf and stag with one rule, but it silently shortens the
stag's warning to the gore's own wind-up and breaks every ATTACK-telegraphed actor already
shipped; my pick breaks if some future actor enters CHARGING from ATTACK *without* the
rear clip's length being a fair warning, and it secretly depends on L5 tracking the
PREVIOUS actionState, which `NpcController` does not do today. Veto = one rule for both.

**13. `doChase` has no source on the seam side.** Three of the four wanderers read a
constructor flag that decides whether they exist as scenery or as a threat — and the horse
does NOTHING AT ALL without it (`EnemyHorse.as:153`, `:232`). In the source it comes from the ROOM
dispatch's own `doChase` argument (`NPCManager.as:694`/`:698`), i.e. from the room that
spawned the actor. `init()` then force-sets it outside the overworld (`EnemyBear.as:42-45`,
`EnemyStag.as:41-44`), which is the only path a stag has. `NpcWorld` has `adventureMode`,
so the `init` path already works; what the seam has no channel for is the ROOM's own
answer. No adapter builds an `NpcWorld` yet, so nothing is broken today — but an adapter
that builds a horse and forgets `doChase` will field a horse that grazes through the whole
fight and reads as a bug in the port, not in the wiring.

**⛔ THE KICKOFF'S FINDING NUMBER IS ANNOTATED.** `L4B_SLICE3_KICKOFF.md` reserves
**finding 12** for the alpha's `NPCManager.createEnemy` spawn. Findings are numbered in
the order they are FOUND and 3a ships before 3b, so 3a took 12 and 13; **the alpha's spawn
becomes finding 14.** Veto = renumber. Nothing else about the alpha's port changes.

### ⛔ NOT DONE — L4b-I at slice level

Slice 3b (`EnemyBoar`, `EnemyWolfAlpha`) and slices 4–6 (15 more descendants).
`EnemyPlayer`'s branch, `CutsceneActor`, the `AI_TIERS` rewire, the fight-feel grade: not
built, not attempted, not claimed. No adapter builds an `NpcWorld`.

## LANE L4b (slice 3b) — THE BOAR AND THE ALPHA: THE FIRST REACTION OVERRIDES, AND AN ACTOR THAT CALLS FOR HELP. ONE FINDING ADDED, TWO KICKOFF CLAIMS CORRECTED BY THE SOURCE (2026-09-12)

**What landed.** `EnemyBoar` (ai 18) and `EnemyWolfAlpha` (ai 11, and ai 16 in the ROOM
dispatch only) — two classes, 948 AS3 lines, neither with children, each written out in
full under its cites with `override` on exactly the AS3's set (nine each). **Slice 3 is
now closed: 21 ported NPC classes, i.e. 23 `SHIPPED` entries** (the map also holds
`MCSActor` and `NPC`, which are not ports) — 13 of the 34 remain. Numbers in
`config/ogEnemyBoar.ts` and `ogEnemyWolfAlpha.ts`. **+42 tests** (1396 → 1438);
**22 guards chaos-planted red on the first pass**, all restored `cmp`-identical.
The seam grew by ONE event and nothing else.

### THE SEAM GREW BY ONE EVENT — `NpcEvent` gained `spawn`

`{ type: 'spawn', npcId, x, y, fatal }` — `NPCManager.createEnemy(npcID, x, y, fatal)`
(`NPCManager.as:869`). `NpcWorld`, `NpcTarget`, `HitShape` and `HitGeometry` are untouched.
The boar needed nothing new at all: its launch arc is the base's, number for number, and
only its GUARDS differ.

### ⚠️ PORTED AS THEY READ — the boar

- **Its three reaction overrides collapse to one body.** `gotKnockDown()` (`:353`) and
  `gotFly(flyVelX, flyVelY)` (`:358`) are ONE LINE each and both call its OWN
  `gotLaunched()`. A boar cannot be knocked down and cannot be thrown; the fly velocities
  are accepted and discarded.
- **`canGotFly = true`** (`:28`) — which RESTATES the base default rather than
  diverging from it. All five `canGot*` flags are declared `true` on `NPC.as:70-78`;
  the divergent classes are the ones that write `false`, and the wolf
  (`EnemyWolf.as:19`) and all four slice-3a wanderers do. The boar never opts out, so
  `NPC.gotHit`'s fly branch reaches `gotFly()` here and becomes a launch.
  ⚠️ Corrected by the adversarial pass: the first measurement called the boar "the
  only animal with `canGotFly = true`" from a grep that only covered classes which
  ASSIGN the flag and never read `NPC.as`. The port was already right; the framing
  was not.
- **Its `gotKnockDown` is a LIVE path, not a theoretical one.** `grep -rl
  Damage.LAUNCH_KNOCKDOWN` over the payload returns **25 files**: the player's own
  charge attack (`MCSPlayer.as:2031`/`:2043`), `ArrowProjectile`, `ChiPunchProjectile`,
  `WindmillProjectile`, `HeavenlySwordProjectile`, `BigRockProjectile`,
  `BoulderProjectile`, `BigWaveProjectile`, `BigFireBreathProjectile`,
  `BigEarthquakeProjectile`, `ChargedShotProjectile`, six `Trap_*Auto` classes,
  `EnemySpearElite`, `EnemyStag`, `EnemyOgre`, `EnemyKanjiGuardian` and more. A boar
  is knocked down by ordinary play constantly, and every one of those becomes a launch.
- **Its `gotLaunched` INVERTS the base's guard** (`:295` vs `NPC.as:538`). The base guards
  `!canGotLaunched || (isDowned() && !actionState == FLY_STATE) || DYING`, whose middle
  clause is the AS3 precedence bug — `!actionState` is a Boolean, so `== 32` is ALWAYS
  FALSE — which kills the whole downed test (ported as it BEHAVES in slice 0). The boar
  has a REAL `actionState == DOWNED_STATE` guard and **no `canGotLaunched` check at all**,
  and its airborne set omits `FLY_STATE`.
- **`doLaunched` lands into WALK** (`:340`), not DOWNED: a boar is never on the floor, it
  bounces up and keeps going. A DEAD boar landing mid-launch goes DYING and calls `die()`.
- **RUN hits on EVERY frame, unconditionally** (`:195-201`): no range test and no
  `isAdventureMode()` fence, unlike every other animal in the lane. Entering RUN rolls
  `knocker` ONCE (`:141`, a d4), and that single roll decides whether the whole charge
  carries `LAUNCH_KNOCKDOWN`.
- **The arrival coin is rolled only in the OVERWORLD** (`:208`): in a room the boar always
  goes back to WALK, and the `int(random() * 2)` is never drawn. This changes the rng call
  count per frame, which is how a test picks the wrong `seq` and silently passes.
- **An un-chased OVERWORLD boar never enters ATTACK** however close it gets — the gate is
  `(this.doChase || !isAdventureMode())` (`:202`).
- **It charges at 10** (`:133`/`:138`) — slower than every wanderer's 12 and the wolf's 15.

### ⚠️ A SOURCE BUG, PORTED AS IT READS

**`EnemyBoar.as:219` plays `DEER_IDLE` on a BOAR.** The off-stage red-freeze branch
red-freezes the actor and then starts a DEER clip; every sibling starts its own idle clip
there. Ported verbatim and pinned; "fixing" it to `BOAR_IDLE` is a chaos plant that goes red.

### ⚠️ PORTED AS THEY READ — the alpha

- **Its `gotHit` is not the wolf's** (`:438`) in two ways. Defence and the minimum-damage
  floor are subtracted **INSIDE** the `getHP() > 0` block (`:480-484`) where the wolf
  subtracts them before it; and **the launch branch has NO `!isDowned()` guard** (`:489`).
  A DOWNED alpha hit with launch-air launches AGAIN, off the floor — a downed wolf does not.
  ⚠️ The defence ORDER is deliberately NOT chaos-planted: it is unobservable. When
  `getHP() <= 0` neither version applies anything, and when `getHP() > 0` both compute the
  same number, so no test can distinguish them. Kept in the source's order for fidelity
  only — the same call slice 2a made for the wolf's mirror-image ordering.
- **`POSE_STATE` spawns a real wolf** (`:289-296`): a coin picks an edge and
  `createEnemy(65, ±50 OUTSIDE it, groundY, true)`. Room only. The fifth parameter `lvl`
  defaults to 0 and the alpha does not pass it, so the called wolf is never `setLevel`'d.
- **Its CONSTRUCTOR calls `startAction(IDLE_STATE)`** (`:23`) like the wolf's and unlike
  all four wanderers — and the IDLE case has a one-in-three howl escape in a room (`:216`)
  that `return`s before the snarl. **So an alpha can emit a spawn before `init()` has run.**
- **`KNOCKDOWNED` falls through into `DOWNED`** (`:271-276`, no `break`), so a knocked-down
  alpha lies there for 48 frames — EIGHT TIMES the wolf's 6 (`EnemyWolf.as:198-202`, which
  does have a `break`).
- **The arrival roll is a d4 whose outcome 2 HOWLS** (`:332`/`:365`); the wolf's is a d3
  with no such outcome. RUN **re-rolls `destX`** (`:248`), which the wolf does not, and is
  a **flat 15 in both modes** where the wolf splits 15 room / 12 overworld.
- **Its bands are wider**: bite `100 < dist < 150`, pounce `150 <= dist < 300`, against the
  wolf's `50..100` and `100..250`. **The pounce hits THREE parts** — head, right hand AND
  torso (`:400-404`) — where the wolf hits two.
- **FALL plays `WOLF_LAUNCHED` and LAND plays `WOLF_LAUNCHEDEND`** (`:278`/`:281`), where
  the wolf plays the pounce clips; and **the pounce-mid clip ending has NO
  `actionState != FALL` guard** (`:190-192`), which the wolf's does.
- **It reads no cutscene at all** — `grep -c CutsceneManager EnemyWolfAlpha.as` → **0**,
  against exactly one each for the other five animals. An alpha wanders mid-cutscene.
- **`doLaunched`, `die` and `redFreeze` ARE byte-equivalent to the wolf's** (`:524`,
  `:542`, `:566`). Written out because the source has the overrides.

### ⚠️ TWO KICKOFF CLAIMS CORRECTED BY THE SOURCE

1. **The `mcs.scaleX == 1` trap has no target.** `L4B_SLICE3_KICKOFF.md` warns that under
   `changeScale(2, 2)` "any `scaleX == 1` test in its switch is FALSE". Grepped
   2026-09-12: there is **no such comparison anywhere** — not in `EnemyWolfAlpha.as`, not
   in `NPC.as`, not in `MCSCharacter.as`. Every `scaleX` use is sign-based
   (`NPC.as:790` `> 0`; `MCSCharacter.as:1462` `return scaleX > 0`) or an assignment, so
   the doubled scale breaks no facing test. The port keeps facing and scale apart anyway,
   as the wolf's does. The warning was sound; it simply has nothing to fire on.
2. **`setLevel` is NOT the spear boss's copy.** The kickoff says to diff it against
   `EnemySpearElite.as:79-123` rather than assume — correctly. Diffed: the four-tier floor
   chain IS the boss's verbatim (and it FALLS THROUGH, so `max(hit, ladder)` is wrong —
   pinned), but **`hitsToKillPlayer` is `15 − lvldiff` here and `18 − lvldiff` for the
   boss**, the boss floors `hitsToKillBoss` at `<= 3 → 3` where the alpha floors at
   `<= 0 → 1`, and the structure is INVERTED: the alpha's `lvl <= 5` is the `if` and the
   whole balance is the `else` (so a level-5 alpha is never balanced at all), where the
   boss balances first and stomps damage/defense afterwards. The alpha also KEEPS the
   animal xp curve (`:73`, ×5 + 45) where the stag's `setLevel` overwrites it with the base's.

### ✅ STATE-SCHEMA DRIFT ON SHIPPED CODE — FOUND HERE, REMOVED ON THE OWNER'S RULING

`src/core/npc/EnemySpearElite.ts` (slice 2b) called `this.scaleTo(lvl)` and assigned
`this.xp` **twice in a row** (`:92-95`). The source does neither
(`EnemySpearElite.as:74-77` has one `factor`/`level` pair). Found while diffing the
alpha's `setLevel` against the boss's.

It was flagged and NOT touched in the slice-3b commit, because the handoff rule is that a
later session does not "fix" what an earlier one left. **Kheshav ruled to remove it
(2026-09-12), and it is removed in its own commit** — the one that carries this paragraph.

**Proven a no-op before removal, not argued.** A 680-row sweep recorded every observable
field a boss exposes after `setLevel` — `level`, `damage`, `defense`, `maxhp`, `hp`, `xp`,
`healthBarVisible`, `healthBarFraction`, the progress bar and the event count — over
5 player profiles × 4 start states × 17 target levels × boss/elite, deliberately including
the edges: target 0 (where the SECOND call's `factor` is `0 / 0` = NaN), target 1, the
trivial floor (≤ 5), the soft cap (20) and all three floor tiers. **Before and after are
byte-identical across all 680 rows**, and slice 2b's suite is 40 tests either side.
Two reasons it is safe: `asInt` maps non-finite to 0 (`MCSActor.ts:35-37`), so the NaN
factor cannot poison a stat; and `updateHealthBar` only writes state (`healthBarVisible` /
`healthBarFraction`), it emits nothing, so calling it twice with the same values is inert.

No new test was added, deliberately: the change introduces no behaviour to red-proof, and
a call-count spy would pin the implementation rather than the behaviour. The sweep plus
slice 2b's 40 existing tests are the proof.

### THE SEAM FINDINGS — one added

**14. The seam cannot add an actor mid-fight.** `EnemyWolfAlpha.startAction(POSE_STATE)`
calls `NPCManager.createEnemy(65, x, groundY, true)` (`:291`/`:295`) — the howl calls a
WOLF into the room. Core emits `NpcEvent { type: 'spawn', npcId, x, y, fatal }` and
**nothing can drain it**: `NpcController` owns exactly one actor, `Sim` has one enemy slot,
and neither has a way to construct a new `Npc`, give it an `NpcWorld`, `init()` it from
the roster and add it to whatever answers `nearestEnemy`. L5 needs a spawn sink that owns
actor lifetime. Two sharp edges for whoever builds it: the spawn lands 50 px OUTSIDE the
stage, so the sink must accept off-stage positions; and **the alpha's constructor can emit
a spawn before `init()` has ever run** (`:23` → `:216` → `:289`), so a sink that assumes
every actor is initialised before it hears from it will be wrong on the first frame.
⛔ **NUMBERING:** the kickoff reserved "finding 12" for this. Slice 3a shipped first and
took 12 and 13, so the spawn is **14**; the kickoff is annotated.

### ⛔ NOT DONE — L4b-I at slice level

Slices 4–6 (13 more descendants: the goblins and ogre, ninja / shield / zombies, the props
including `EnemyVegePatch`, the bosses). `EnemyPlayer`'s branch, `CutsceneActor`, the
`AI_TIERS` rewire, the fight-feel grade: not built, not attempted, not claimed. **No
adapter builds an `NpcWorld`**, and nothing drains `spawn`.

---

## THE SEAM SPIKE — ONE PORTED ENEMY PUT INTO THE REAL DUEL. **SEAM NEEDS WORK**: FOUR FINDINGS ADDED (2026-09-17)

21 classes were ported and none were in the game. This spike put exactly one —
`EnemyKatana`, the cheapest real fighter — behind the existing `OpponentController`
seam in the shipped duel, behind `?npc=katana`, and measured what happened.
`Sim.ts`, `OpponentController.ts` and `NpcController.ts` were not touched.

**It runs.** The actor walks itself at the player, commits, swings, and kills the
player in ~16.6 s — measured headless in `tests/duelSeam.test.ts` and confirmed live
in the browser (enemy x 557 → 285, player 100 → 0 HP). So the answer is not "the seam
is a dead end". It is **SEAM NEEDS WORK**, with four specific channels named below.

### WHAT WAS ACTUALLY MISSING — and the kickoff was wrong about it

The kickoff said the `AnimLibrary` connector was the spike's real work, because
"the DATA is already in the repo: `src/config/ogAnims.ts` (854 lines, `OG_ANIMS`)".
**`OG_ANIMS` holds FOUR clips** — `walk` and the three `balancedhorizontalslash`
parts — and neither `walkwithkatana` nor `katanaattack` is among them. 854 lines is
four animations' worth of per-frame nodes, not a clip table.

The real table was never transcribed. `OG_ANIM` (`ogActor.ts`) is the AS3 list of
**429 animation KEYS**; the payload defines **158 clips**, of which 122 have an
`OG_ANIM` name. So `scripts/anim/transcribeAnimClips.py` now emits
`src/config/ogAnimClips.ts` — all 158 clips' `d=` and `l=`, verbatim, byte-checked
in both directions by `tests/ogAnimClips.test.ts`. Of the 20 clips `EnemyKatana`
names, **17 are defined**; the 3 that are not (`fly_end`, `getup_front`,
`kneegroin_victim`) are reaction clips no duel path reaches, and a missing clip is
the source's own `trace("missing animation")` no-op — faithful, not a gap.

Two other kickoff numbers moved: `NpcWorld` has **seventeen** members, not ten; and
the adapter did not need `NpcController` changed at all.

### THE `HitGeometry` DECISION — degenerate, deliberately, and MEASURED

`DuelHitGeometry` answers "no part" to every question. That is correct **here** and
wrong anywhere a body can be struck part-by-part: in a duel `Sim.executeStrike`
resolves damage against its own `FighterState` and never calls into the actor, so no
per-part question is ever asked. This is not asserted — the class counts every call,
and the probe pins `consulted === 0` across a whole fight, so the day a duel path
does ask a geometric question the test goes red instead of silently getting `null`.

### THE SEAM FINDINGS — four added

**15. [⛔ FALSIFIED 2026-09-23 — NOT A DEFECT; see "THE UNITS AND THE WINDUP" below.
The actor's `x` and ranges are LOGICAL px, which ARE world px — no conversion is
missing, and adding one would break the katana.]** ~~The actor's ranges are OG SCREEN
px; the Sim's positions are WORLD px, and nothing converts.~~ `OG_KATANA.melee.x` is 100 (`EnemyKatana.as:167`), and the seam
hands the actor `view.enemyPos.x` in world px, where the repo's own conversion is
`/1.2` (100 OG px ≈ 83 world px). Worse, `Sim.executeStrike` range-gates **nothing** —
it trusts the intent — so the katana lands hits at its raw 100. Measured: it commits
and strikes at a **95.4 px** gap, against the shipped `AISeamController`'s **48.2 px**
on the same duel — **1.98×**. That is precisely the `AI_STRIKE_RANGE` regression
SESSION13 D8 removed ("2× too generous"), reintroduced through the actor's own
constants. ⇒ Every one of the 34 actors' distance constants needs a declared unit and
one conversion at the seam. **Cost: small but load-bearing** — one conversion in the
adapter, plus an audit of every distance constant in `src/config/og*.ts` for which
space it is in. It cannot be skipped: the whole family's ranges are wrong without it.

**16. The seam is ONE-WAY: the actor never learns it was hit.** `OpponentView` carries
position, stance, focus and `playerJumping`. It carries no enemy HP and no "you were
struck". So the Sim's `FighterState` takes the damage and the actor does not: measured,
`actor.getHP()` and `gotHitCounter` are unchanged after twelve landed player slashes.
`NPC.gotHit` — defence, the element floors, behead, and all seven reaction states with
their per-frame physics — is **dead code in a duel**. The hit reaction is a large part
of what the fighter looks like in the videos. ⇒ Needs a damage channel from Sim to
controller. **Cost: the big one** — it moves `OpponentView`/`OpponentController`, which
this spike was forbidden to touch, so it is an L5 decision, not a slice-4 one.

**17. The actor never dies.** When `enemy.hp` reaches 0 the Sim simply stops polling
(`if (enemy.hp <= ZERO) continue`), so `NPC.die()` — the death clip, the loot roll, the
XP award, the four-second fade — is unreachable. Measured: the Sim's enemy is at 0 HP
and the fight has ended while `actor.dead === false`, `actionState !== DYING`, and the
actor has emitted **zero** events. The corpse on screen is the Sim's `corpseAlpha`, not
the actor's death animation. ⇒ Same channel as 16, opposite direction, and it is what
finding 5 ("presentation events have no seam channel") costs in practice: with no hits
and no death, nothing ever *generates* an `NpcEvent`, so the undrained event list is
not yet a bug — it is a channel that has never carried anything.

**18. [✅ CLOSED 2026-09-23 — 1 → 35 telegraphs for 35 swings; see "THE UNITS AND THE
WINDUP" below. ⚠️ Numbers superseded the same day: with `AnimData`'s holds, 20 for 20, each
750 ms — "L5-OPP SLICE 0 … THE GAUNTLET REVIEW".] THE WINDUP IS DRAWN ONCE, THEN NEVER AGAIN.** `NpcController` derives `telegraph`
by edge-detecting ATTACK_STATE across a whole `update()`. But the re-attack cycle
completes *inside* one `update()`: `stepAnimation` finishes `katanaattack` →
`startAction(WALK)` → `doAction()` sees the target still in range → `startAction(ATTACK)`.
Before and after are both ATTACK, so there is no edge. Measured: **one telegraph for
twenty-four landed swings**, and the trace shows `actionState` reading ATTACK on every
single step while `frameCounter` cycles 0→9→0. The windup is how a player reads an
attack — `AI_TELEGRAPH_MS` is CONTRACT for that reason — so twenty-three unannounced
swings is not the game in the videos. ⇒ The controller must detect the clip RESTART,
not the state edge. **Cost: small, and it is inside `NpcController`** — no seam move.

### ⚠️ AND THE THING NO GATE CAUGHT — it stands still

Findings 15–18 are each a channel. Together they produce a fight that is measurably
wrong in a way none of them names on its own: **the katana closes once, stops at 95.4 px
and never moves again.** Traced live over 900 frames, the gap is 95.4 at every sample.
It is not a bug in any single port — `doAction()`'s ATTACK branch legitimately does not
move, and the original re-attacks in range too — but combined with a Sim that only moves
an enemy on a non-zero `moveX`, the result is a statue that machine-guns from two
sword-lengths away. **Whoever fixes 15 must re-measure this**; it may simply be 15
wearing a costume, and it may not. **[MEASURED 2026-09-23: neither — it is the source's
own behaviour against a player who stands still, and the katana re-closes the moment the
gap opens. See below.]**

### ⛔ WHAT THIS SPIKE DID NOT DO

Slices 4–6 are NOT started, and their kickoff is not written — it was always due after
this answer, because this answer changes what it must say. No fight-feel grade is
claimed: that is a LOOK, and only Kheshav can give it. `AI_TIERS` is not rewired. The
flag defaults OFF and `AISeamController` remains the shipped opponent (verified live:
no query string → `npcKatana === false`, and the duel closes to 48.2 px exactly as before).

## THE UNITS AND THE WINDUP — 15 FALSIFIED, 18 CLOSED, THE STATUE MEASURED, ONE FINDING ADDED (2026-09-23)

Run from `docs/sessions/UNITS_AND_WINDUP_KICKOFF.md`, whose first task turned out to rest
on a wrong premise. `Sim.ts`, `OpponentController.ts` and every `src/config/og*.ts` value
are untouched; `NpcController.ts` changed in one place.

### 15 — FALSIFIED. The actor's units ARE the Sim's units. No conversion was missing.

The spike read `OG_KATANA.melee.x` (100) as OG **screen** px and expected ~83 world px at
the ×1.2. The source says the actor never sees screen px at all:

- `GameEngine.resizeHandler` calls `gameStage.doResize()` (`GameEngine.as:345`), and
  `GameStage.doResize()` scales **the whole `GameStage` itself** by the window factor
  (`GameStage.as:1244-1246`); `setFullScreen` does the same to it (`GameEngine.as:187`).
- Every NPC is a child of that stage's canvas: `NPCManager` takes
  `StageManager.getGameStageCanvas()` (`NPCManager.as:95`) and `MCSActor.addToCanvas`
  does `canvas.addChild(this.mcs)` (`MCSActor.as:1029`). The player goes into
  `getGameStage().getPlayerCanvas()` (`GameEngine.as:1042`).
- So `mcs.x`, `target.x` and the `100` they are compared against are all **logical
  800×480 px** — which is exactly the Sim's WORLD (`config/display.ts`: "source values drop
  in with no conversion at all"). The ×1.2 happens *outside* the game, to the whole stage.

**Before / after: the commit gap is 95.41 px, unchanged, and that is correct.** Applying the
kickoff's conversion would have made the katana commit at ~83 — a bug introduced by a fix.
The comparison with `AISeamController`'s 48.2 px was never a units comparison: they are two
different fighters (the kickoff's own ⛔ block already said so).

**Pinned** (`tests/duelSeam.test.ts`, "FINDING 15 (closed, not a defect)"): the first strike
lands in `[100 − 7.09, 100)` — 7.09 being the most the Sim can close between two actor
decisions (`ceil(60/24)` = 3 ticks × `ENEMY_SPEED` × 16.67 ms). A scale at the seam either way
leaves the band; chaos plant "units: scale the distance the actor sees at the seam".

⚠️ **What IS true in the old 15, and belongs to a different finding:** `Sim.executeStrike`
range-gates nothing, and the seam's `PlayerProxy.checkHitObject` answers yes to every swing its
guard allows. The source tests the weapon PART against the body; ours lets the decision range
alone decide reach. That is the `DuelHitGeometry` decision (degenerate on purpose, see above),
not a unit error — and it matters only once a swing could plausibly miss.

### 18 — CLOSED. One telegraph per swing: 1 → 35, for 35 swings.

Measured on the real duel: **before, 1 telegraph for 35 swings** (the spike's "24" counted
*landed* swings — 11 more are refused by the player's twelve-step guard). **After, 35
telegraphs for 35 swings, every one 416.67 ms** (`katanaattack`, 10 frames at 24 fps). Swings
are counted independently of the controller, as starts of the attack CLIP.
⚠️ **Superseded 2026-09-23:** those 10 frames were the file's bare `d=`; `AnimData` adds an
8-frame hold (`AnimData.as:77-78`), so the swing is **18 frames = 750 ms**, and the same duel now
measures **20 telegraphs for 20 swings**. The fix itself (one telegraph per `startAction(ATTACK)`)
stands. See "L5-OPP SLICE 0 … THE GAUNTLET REVIEW".

**The fix is not the one the kickoff suggested, and why is measured.** The kickoff said "detect
the clip restart". A clip cannot carry it for the family:
- **10 of the 13 attacking classes name an attack clip that `OG_ANIM_CLIPS` does not define**
  (finding 19, below), so their `startAnim` is a no-op and nothing restarts;
- `EnemySpear`'s swing is two clips (`spear_stab_parta` → `_partb`), so "the clip changed while
  in ATTACK" fires twice per swing;
- and a looping clip's wrap is a restart too — `walkwithkatana` wraps every 20 frames.

Instead `NpcController` listens on the actor's own **decision**: every `startAction(ATTACK)`.
Measured: 22 such calls across all 13 attacking classes, each in a non-attacking branch or
starting a fresh attack, and **zero** classes that assign `actionState = OG_STATE.ATTACK`
directly — pinned by a source scan in `tests/npcController.test.ts`, so a class that bypasses the
call would go red rather than swing with no windup. The ported classes are untouched; the
controller wraps the one instance's method.

**Gates** (all red-proofed by `tests/duelSeam.plants.ts`): telegraphs = swings across a whole
fight (fails too few AND too many — a controller firing on every ATTACK step passes any
"more telegraphs" check); and three walk cycles out of range emit **zero** telegraphs while the
walk clip is proven to have wrapped (fails the kickoff's clip-restart detector).

Identical on seeds 1, 2, 3, 7 and 42 — which is NOT five times the evidence: the Sim owns the
katana's x, and the actor's only rng draw (`walkSpeed`) never reaches the Sim.

### ⚠️ WHAT 18'S FIX LOOKS LIKE ON SCREEN — measured, and not graded

(⚠️ Re-measured 2026-09-23 with `AnimData`'s holds: every **45 ticks = 750 ms**, each aura
750 ms, still zero gap — the paragraph's conclusion stands; its numbers were the bare `d=`.)
While the katana swings in place, a telegraph arrives every **25 ticks = 416.67 ms** — exactly
the length of the aura each one arms (`DuelScene` sets `telegraphUntil = now + durationMs`). Zero
gap: the red windup aura is **on continuously** from the first swing to the end of the fight, and
its pulse runs on its own clock (`sin(fxNow / 90)`), not per swing. Before the fix it flashed
once. That is truthful — the katana never stops attacking, which is the source's own cycle — but
a duration-based aura cannot show a beat between back-to-back attacks. **Not changed here:** how
the cue should look is a LOOK against the videos, and the OG has no aura at all (its windup is the
swing animation). The cheapest option if the owner wants a visible beat: phase the pulse from the
latest telegraph's start instead of the free clock (render-only, `DuelScene`).

### THE STATUE — MEASURED: NOT A DEFECT, THE SOURCE'S OWN BEHAVIOUR. No finding 19 for it.

With 15 falsified it could not be "15 in a costume", so it was measured on its own. The
decisive question is whether the katana FOLLOWS when the gap opens. It does: backing the player
off to a **101.66 px** gap, the katana leaves ATTACK, walks **4.7 px**, re-closes to **96.94 px**
and swings again. `EnemyKatana.doAction`'s ATTACK branch never moves and a finished swing
re-enters ATTACK while the target is in range — so against a player who stands still, standing
still IS the katana. Pinned: "THE STATUE — stands only while the player does"; chaos plant "seam:
stop relaying the actor's walk once it has attacked (a real statue)".

### 19 — [✅ CLOSED 2026-09-23 — a transcription gap, not missing art: the table read 1 of the 18 files the source loads; see "L5-OPP SLICE 0 — THE ANIMLIST" below.] ~~NEW: TEN OF THE THIRTEEN ATTACKING CLASSES NAME AN ATTACK CLIP WE DO NOT HAVE~~

Measured against `OG_ANIM_CLIPS` (the 158 clips transcribed from the payload):

| has its attack clip | missing its attack clip |
|---|---|
| `EnemyKatana` (`katanaattack`), `EnemyKnife` and `EnemyArcher` (`stabattack`) | `EnemyBoar`, `EnemyBear`, `EnemyStag`, `EnemySpear`, `EnemyWolf`, `EnemyWolfAlpha`, `EnemyFox` (inherits `wolf_bite`), `RoomGoblin`, `RoomOgre`, `EnemySpearElite` (0 of its 6) |

What follows is code, not measurement: `startAnim` returns early on a missing clip, so
`animation` keeps the PREVIOUS clip. Then (a) the telegraph's length reads that stale clip, and
(b) a class that leaves ATTACK only when its attack clip finishes would never leave it if the
previous clip loops. **(b) is INFERRED — not measured per class.** Whether these clips live in
another asset of the payload was **not checked**. ⇒ **Slice 4's kickoff must open with this:**
find the clips or rule on their absence before wiring any of the ten into a duel. **Cost:
unknown until that search is done.**

### ⛔ WHAT THIS SESSION DID NOT DO

Slice 4 is not started and its kickoff is not written. Findings 16 and 17 are untouched (L5).
No fight-feel grade is claimed — the telegraph on every swing is measured headless; whether it
READS like the videos is Kheshav's look at `?npc=katana`.

## L5-OPP SLICE 0 — THE ANIMLIST: FINDING 19 CLOSED. THE CLIPS WERE ALWAYS IN THE PAYLOAD (2026-09-23)

Kickoff: `docs/sessions/L5_OPPONENT_KICKOFF.md` §3 (slice 0). Survey:
`docs/research/L5_DUEL_OPPONENT_SURVEY.md` §4.

**The defect was the transcriber, not the payload.** `MCSCharacter.initAnimationData`
(`MCSCharacter.as:178-219`) pushes **18 animation files** into one list and indexes them into
ONE global `animList` by clip name, a later file overwriting an earlier one.
`scripts/anim/transcribeAnimClips.py` read exactly one of them, the human file (158 clips),
and its header called that "all 158 clips the payload defines". Every clip finding 19 listed
as missing is in one of the other 17.

**Now:** the transcriber reads the load order FROM `MCSCharacter.as`, reads the 18 Android
files, applies last-write-wins, and refuses a listed file that is missing, a data file the
list does not name, a repeat that disagrees, or a `d=` that is not its frame count.
**471 blocks → 466 clips**; 5 names appear in two files (`mining`, `walkwithspear`,
`spearbowjump`, `spearbowdropdown`, `chargewithspear`), each time identical, so the order
changes no value. **The 158 old entries are byte-unchanged; 308 were added.** **428 of
`OG_ANIM`'s 429 names now resolve**; the one that does not, `flurry_parte`, is named in
`MCSActor.as` and defined in no file — the source's own `trace("missing animation")`,
pinned so nobody invents it. `fly_end`, `getup_front` and `kneegroin_victim`, pinned as
"not in this payload" since the seam spike, are defined.

### WHAT IT COST — MEASURED, NOT INFERRED

Each of the 13 attacking classes on the real `OgAnimLibrary`, `createDuelWorld()` and
`NpcController`, spawned in the source's order (`setPosition` then `init`,
`NPCManager.as:636-637`), built as the variant that FIGHTS, against a still player 60 px away,
for 30 s, `mulberry32(7)` — exactly `tests/animList.test.ts`. `startAction(ATTACK)` counts:

| | one-file table | the source's animList, holds included |
|---|---|---|
| `EnemyKatana` / `EnemyKnife` / `EnemyArcher` | 72 / 52 / 46 | **40** / 52 / 46 (the katana's hold — see THE GAUNTLET REVIEW) |
| `EnemyBear` / `EnemyBoar` / `EnemyStag` / `EnemySpear` (stabber) / `EnemyWolf` | **1 each, then ZERO further state changes** | 4 / 32 / 6 / 17 / 33 |
| `EnemyWolfAlpha` / `EnemyFox` / `RoomGoblin` (chasing) / `RoomOgre` (chasing) / `EnemySpearElite` | **1 each, then ZERO** | 25 / 45 / 19 / 36 / 38 |

So finding 19's INFERRED "(b) may never leave ATTACK" was **true for all ten classes it named.**
Three of them only fight as one variant, and the test builds that one: `EnemySpear` rolls
`isStabber` at construction (`EnemySpear.as:19`; only a stabber enters ATTACK, `:233-235`), and
`RoomGoblin`/`RoomOgre` chase only with the `doChase` flag the room data sets
(`Obj_NPCAggro.as:58-63` → `NPCManager.as:710-716`). The exact counts depend on the seed (a
300-seed sweep put the boar at 9–39); the test pins `> 1`, and these are the seed-7 values.

**Two errata, both caught by measuring rather than by reading.** (1) Kickoff §3's slice-0 table
said "4 frozen, 6 never attack". Three of those six (wolf, alpha, fox) were an artefact of the
probe calling `init` BEFORE `setPosition`: the reverse of the source's order spawns an animal
mid-air, and a fallen alpha goes FALL → LAND → `WOLF_LAUNCHEDEND` → a looping `WOLF_DOWNED` that
LAND never leaves (`EnemyWolfAlpha.as:151-163`, `:429`), a real source trait, not finding 19.
(2) This section's first version said "seven, not ten": it built the spear, goblin and ogre as
their non-fighting variants, and quoted counts from a scratch probe with a different rng. The
gauntlet review caught both.

### THE GATES

- `tests/ogAnimClips.test.ts` — rewritten: 466 clips; 428 of 429 names; `flurry_parte` the
  one gap; the byte-check now reads the load order from `MCSCharacter.as` (one source, no
  second copy), refuses unlisted and missing files, pins the 5 agreeing repeats and the 471
  blocks, and checks both directions.
- `tests/animList.test.ts` — **new**, red on the one-file table for all ten (each: 1 attack, 0
  state changes after; first failure `EnemyBear asked for undefined clips: [bear_walk,
  bear_run, …]`), green on the new one.
- `tests/duelSeam.test.ts` — the "null for a missing clip" pin moved from `fly_end` to
  `flurry_parte`, and asserts `fly_end` now resolves.
- `tests/animList.plants.ts` — **4 new chaos plants** (49 → 53 in both pins): three on a clip
  from a file the old table never read, one that strips the katana's hold.

### WHAT THIS SLICE DID NOT DO

It ported no class. It changed no `src/core/` code except one comment (`duelSeam.ts`'s
`OgAnimLibrary`), and `Sim.ts`, `OpponentController.ts` and `NpcController.ts` are
untouched. `?npc=katana` fights as before EXCEPT its swing length: its 3 clips that were
missing (`fly_end`, `getup_front`, `kneegroin_victim`) are reaction clips no duel path reaches,
but its attack is now 18 frames, not 10 (the hold; see below). The web payload's 19th file (a
spider) and its version differences (ogre 6 durations + 2 web-only clips, guardian 1 + 1,
spearman 3 web-only + 4 pose edits, 3 Skills poses; hold table: web adds `downedup` +12 and
drops `light_afterslashpose` +10) are NOT in the table, by ruling R5.

### THE GAUNTLET REVIEW (2026-09-23) — four read-only reviewers, 4 of 4 returned

Two correctness reviewers on the slice-0 code and gates, two refuters on the survey and the
kickoff against the source. Every finding below was re-verified in the parent loop against the
source before anything changed.

**1. THE HOLDS — the table carried the bare `d=`, not the length the source plays.** (Found
independently by both code reviewers.) `AnimData`'s constructor sets `duration = xml.@d`, then a
switch on the clip name adds a hold (`AnimData.as:12-135`: 30 groups, 58 names, +2 to +50, no
fall-through), and the clock ends a clip only at that total (`MCSCharacter.as:1311`). So
`katanaattack` is **10 + 8 = 18 frames = 750 ms**, not 417 ms. It was already written up in the
L0 ledger (`docs/gauntlet/L0/run5/CLAIMS.md`, "animdata-code-injected-hold-table") and never
applied. It predates today (the seam spike's 158 clips carried it); slice 0 spread it to 466.
The web build's hold table (`§1t783s0§.as`) agrees on 56 of 58 names, the katana's +8 included.
**Fixed:** the transcriber reads `AnimData.as` (labels resolved through `MCSActor.as`) and adds
each hold; the byte-check re-derives the holds independently; 58 clips changed. **Measured
consequence in the real duel (`?npc=katana`):** 35 → **20** swings and telegraphs, each 750 ms,
still one every 45 ticks with zero gap; the player still dies at **16.55 s** with **24** damage
events either way — damage events outnumber swings, so the Sim's side paces the damage. Why the
damage count does not move with the swing rate is NOT investigated (finding 16's one-way seam is
the suspect).

**2. TEN, NOT SEVEN** — see the corrected table above.

**3. Not fixed, with the reason.** (a) On CI the byte-check skips (`reference/` is local-only by
the licence ruling), so CI pins only a handful of clip values; the local pre-commit runs the
byte-check on every commit. (b) The test's `<anim>` regex is the generator's, so they share
blind spots (an XML comment, `d=` before `i=`); a real XML parser agrees on all 471 blocks today,
and the data is not re-extracted. Both are recorded, not patched.

**4. The survey and the kickoff** carried seven wrong claims against the source; each is
corrected in place (the survey's "CORRECTIONS" block, the kickoff's ERRATUM and ruling R6).

## L5-OPP SLICE 1a — THE PROFILE STRINGS: THE PARSE, AND THE FIRST R6 RULINGS (2026-09-28)

Kickoff: `docs/sessions/L5_OPPONENT_KICKOFF.md` §3 (slice 1, split here into 1a and 1b; see its
ERRATUM 3). A build-loop cycle, one commit.

**What landed:** `src/core/npc/duellistProfile.ts` parses a duellist's three strings the way the
source does, with every number in `src/config/ogDuellistProfile.ts`. Ported, Android line ranges:
`XMLNpc.parseBattleStatsString` (`XMLNpc.as:216-270`), `parsePlayerStatsString` (`:688-701`),
`parseEquipmentString` (`:703-712`), `parseSkillStatsString` (`:714-727`), `getMastery`
(`:671-686`), `Item.parseNoQty` (`Item.as:106-163`) with `isClanInvitation` and `setCreator`,
and `IntStat.parse` (`IntStat.as:19-23`). **Not yet:** the DERIVED stats
(`StatsManager.findBonusStatFrom`, `initDuelist`'s arithmetic, `EnemyPlayer.init`,
`MCSPlayer.initPlayer/initAttackStats/initElementDefenseStats`). That is slice 1b, for the
reason in the last block below.

### THE R6 DIFF — every ported function against its web twin, read line by line

| function | Android vs web | shipped |
|---|---|---|
| `parseBattleStatsString` (web `§1t9220s0§`) | the same 14 cases into the same 14 slots, no default in either, **but the web writes a field only `if(_loc5_ <= 13)`** (`§1t76s0§.as:277`): an 18-field string's fields 14–17 are DROPPED. Android writes every field, so they overwrite `buff2Expiry` and the last wins | **web: dropped** (found by the review, below) |
| `parsePlayerStatsString` (`§1t1256s0§`) | identical: 14 or 18 fields, else `i < length - 1` | Android = web |
| `getMastery` | identical | Android = web |
| `parseEquipmentString` (`§1t1257s0§`) | **web cuts the string at the first `^`** (`§1t1701s0§.§1t11255s0§ = "^"`) | **web: cut** |
| `Item.parseNoQty` (`§1t17s0§.§1t8745s0§`) | **Android clamps every stat modifier** to `ItemGenerator.getModMax` (the `prog1..5[79]` caps: 90 attack/defense, 146 hp/chi, 37 elements, regen and crit, 53 speed, 16 piercing). **The web build does not clamp**, and its `addModifier` does not either. The web build also reads ids 206–208 as item fields | **web: no clamp.** 206–208 NOT ported: they land as ordinary modifiers, as on Android, and no stat id reaches 206 |
| `parseSkillStatsString` + `IntStat.parse` (`§1t9221s0§`, `§1t57s0§.parse`) | **web cuts at `^` and adds 1000 to any id below 1000** (`parse(field, 1000)`, `§1t76s0§.as:301`). The web cut runs BEFORE its null check, so a null string throws there; Android returns `[]` | **web: cut and floor; Android's null-first order** |

**Why web, each time (R6: the videos are the web build, and its numbers win):**
- **The battle-string guard.** `buff2Expiry` feeds `initDuelist`'s halving test, so on an
  18-field string the builds can take different branches. *Red-team:* the guard only matters
  for 18-field strings, and nothing measured yet says who writes them. **Veto:** remove the
  guard (its plant is the diff).
- **No clamp.** A web profile with a modifier above the cap fights at the full value, so ours
  does too. It also saves porting `ItemGenerator`'s five progression tables for a branch the web
  never runs. *Red-team:* the clamp is Android's defence against a hand-edited string. The
  profile source is our own table (slice 2), so there is no hostile string to defend against.
  Where it breaks: if slice 2 imports a profile saved by the ANDROID build with an over-cap
  value. **Veto:** re-add the clamp (the plant `re-plant the Android modifier cap` is the diff).
- **The id floor.** All 75 skill-table ids sit at 1000 or above (1000..1501, `ogSkills.ts`; the
  web payload has no skill table), so the floor maps a short legacy id onto the table and leaves
  a real one unchanged. The premise is a test, so a table change turns it red. *Red-team:* on
  Android a legacy `"5,3"` is skill 5, which exists nowhere, so the duellist silently lacks it;
  with the floor it has skill 1005. That is the web's behaviour, and the videos are web.
  **Veto:** drop the floor (one line; its plant is the diff).
- **The `^` cut.** A no-op on a string without `^`; the web format on one with it. R1 wants a
  real saved profile to drop in unchanged, and real profiles are web. **Veto:** drop the cut.
- **Android's null order** in the skill parse: the web build's order throws on a null skill
  string. Nothing in either build passes null on the duellist path (`initDuelist` hands over
  the server's string), so this only chooses between `[]` and a crash on bad input.

### CLAIMCHECK CAN CHECK A WEB CITE — MEASURED (the kickoff's "slice 1's first job")

Every value in `ogDuellistProfile.ts` carries its Android cite AND its web cite as a full
`reference/decompiled/shs3_payload/scripts/§…§.as:<line>` path, and claimcheck checks both at
±0 with no change to the gate: its filename pattern already admits `§`, and a path-carrying
cite is read verbatim. It went RED on a real miss on the first run: `§1t57s0§.as:23` holds
`if(_loc4_ < param2)`, not the 1000 I cited it for. So R6's "extend claimcheck before the first
web number lands" is not needed. The web cites make the R6 diff a GATE for these values: a web
number that drifts from the Android one now fails the commit.

### THE PORT'S QUIRKS — PINNED, NOT FIXED

- An 18-field battle string keeps only its first 14 fields (the web guard; on Android the
  last of fields 14–17 would win `buff2Expiry`).
- A slot-by-slot stats string drops its LAST field, with or without a trailing `|`.
- An item string with a third comma field reads NO modifiers.
- A creator mod clears `named` only if the name mod came first and was `"0"`.
- An empty skill string is ONE skill: id 0, floored to 1000, at level 0.
- AS3 coerces every field with `int()` / `uint()`, ECMA-262 ToInt32 / ToUint32 of ToNumber:
  `"abc"` → 0, `"12.9"` → 12, `"-3.9"` → -3, `"0x10"` → 16, a colour of `-1` → 4294967295.
  **No Flash VM runs here**, so these are the spec's answers, not an executed AVM2's. One known
  gap: ES2015 `0b`/`0o` literals parse in JS and are 0 in AS3; the game's strings never hold them.

### ⚠️ FOR SLICE 1b: R6's "STRUCTURE IS NEVER MIXED, ONLY LITERALS" FAILS AT THE DERIVED STATS

Measured this cycle, not ported:
- **`findBonusStatFrom` differs in STRUCTURE.** Android (`StatsManager.as:2029-2070`) skips
  head, neck and scabbard, and adds the item's defense, the item TABLE's modifiers
  (`itemXML.modifierXML`) and the item's own modifiers. Web (`§1t1523s0§.as:2464-2506`) also
  skips **hair** (`§1t9441s0§ = 2`), and **never adds the table's modifiers**, although the web
  item record carries them (`§1t104s0§.as:52`). On any profile wearing one of the 93 items with
  table modifiers, the two builds give different stats.
  **⛔ WRONG, corrected by slice 1b-i below:** the web sum reaches the table's modifiers through
  `Item.getModifiers` (`§1t17s0§.as:1703-1729`). The real web-only difference is that getter's
  attack/defense → max-HP pool.
- **`initDuelist` differs in structure too** (web `§1t1248s0§`, `§1t76s0§.as:340`): a `stance`
  argument; attack ×1.5 or defense ×1.5 while a buff is live (buff type and expiry against the
  server clock); the halving under a two-mode test instead of Android's one. The web paperdoll
  also carries glove, hat and mask colours.

These are branches that exist in one build only, which R6 says are "ruled per case", and each
changes a number the fight uses. Slice 1b rules them before porting. A build-loop cycle does
not guess them.

### THE REVIEW — one fresh-context reviewer, one real bug, fixed

The reviewer read the diff against both builds and found that **my "identical" for
`parseBattleStatsString` was false**: the web build guards its write with `if(_loc5_ <= 13)`.
Re-verified at `§1t76s0§.as:277` before acting. My diff had been a grep that extracted only the
`case` lines, so it could not see a guard written after the switch. The first draft had pinned
Android's behaviour (buff2Expiry = 44) and even planted the WEB behaviour as the bug. Fixed red
first (`expected 44 to be 7`, 2 tests), with the web's 13 added to config under its web cite and
plant #1 replaced by "drop the web guard". Everything else it checked held: every index and id
in both builds, the caps, the null and uint cases, the mod-order dependence. It also flagged one
thing nobody can settle here: whether AVM2 reads `"-0x10"` as -16 (JS and ES3's grammar say NaN).
Now disclosed in the port's header.

### THE GATES

Baseline at `7949b91`, re-measured: 87 files / 1683 tests · typecheck 0 · lint 0 · claimcheck
1716 cites / 421 values / 0 failures · chaos 53/53. After: see `RESUME_HERE.md`.

## L5-OPP SLICE 1b-i — THE DERIVED STATS: THREE RULINGS, AND `initDuelist`'s RECORD (2026-09-28)

Kickoff: `docs/sessions/L5_OPPONENT_KICKOFF.md` "Slice 1b in detail", steps 1–2 (its ERRATUM 4
splits 1b into 1b-i and 1b-ii). A build-loop cycle, one commit.

**What landed:** `src/core/npc/duellistStats.ts`. `deriveDuellist(stats, eq, skills, serverTime)`
returns `initDuelist`'s fight numbers: hp, chi, attack, defense, speed, the four elemental
attacks and four defences, critical, piercing, the weapon's `minDamage` / `damageRange` /
`slashUsage`, the paperdoll's weapon id, and the skill list. `findBonusStat` is
`findBonusStatFrom`. The new values live in `ogDuellistProfile.ts`, each cited in both builds
where it exists in both; claimcheck's checked values went 445 → 466, all at ±0. **Not yet (1b-ii):** `EnemyPlayer.init`
and `MCSPlayer.initPlayer/initAttackStats/initElementDefenseStats` on top of this record, and
the web-only `stance` argument that `EnemyPlayer.init` consumes.

### ⛔ THE KICKOFF'S PREMISE FOR RULING 1 WAS WRONG — measured

Slice 1a's block above says the web `findBonusStatFrom` "never adds the table's modifiers". It
does, through another door. The web sum reads `_loc5_.§1t522s0§()` (`§1t1523s0§.as:2489`),
which is the web `Item.getModifiers` (`§1t17s0§.as:1643-1731`), and that getter APPENDS the
item row's `modifierXML` to the item's own list (`:1703-1729`). So both builds count the
table's modifiers. The real structural difference is inside that getter, and it is web-only:

1. **Stat → HP.** An item's OWN attack modifier on an armour (type 0, including the 153 rows
   with no type) or a hat (type 3), or its own defense modifier on a ring or amulet (type 11),
   is not counted as attack or defense. It is pooled into max-HP (`:1670-1677`).
2. **The pool merges into the item's LAST own max-HP modifier, capped at 173** (`:1694-1700`), or,
   with no own max-HP modifier, is pushed as a new one, **uncapped** (`:1692`). A pool at or
   below zero is **dropped**, the attack along with it (`:1688`).
3. **Table modifiers with the id of an existing modifier are MERGED** into it (`:1709-1722`),
   except ids 103 and 106, which are always pushed separately.

### THE THREE RULINGS

| # | the branch | Android | web | ruled |
|---|---|---|---|---|
| **1a** | the sum's skipped slots | head, neck, scabbard (`StatsManager.as:2038`) | + **hair** (`§1t1523s0§.as:2476`) | **web**. Measured reach: of 73 hair items (type 2), **0** carry a `defense` and **0** carry a table modifier. Only a hair item's OWN modifiers are lost. |
| **1b** | what the sum adds per item | row `defense` + row modifiers + own modifiers | row `defense` + `getModifiers` (the HP pool, then the row's modifiers) | **web**. Measured reach: **3** of the 93 items with table modifiers carry one the derived stats read: 4050 Zaku armour (attack 10, HP 30), 7028 Helmet (speed 10, HP 20, defense 5), 11034 Pants (HP 30, speed 8). The HP pool reaches any armour, hat or ring worn with an own attack or defense roll. |
| **2** | `initDuelist`'s buffs | none | attack ×1.5, else defense ×1.5, while `buffExpiry > serverTime` (`§1t76s0§.as:375-383`) | **web, with the clock injected** (`deriveDuellist`'s `serverTime`; core has no `Date.now()`). Truncated into an `int`, toward zero. |
| **3** | the halving test | `isPvPRoomMode()` (action 12, not overworld) | PvP room OR `action == 10` (war room), and only when no buff fired | **NOT ported: the Sim has no PvP room and no war room.** (First written as "Duel Mode is action 6"; the review showed `initDuelist` runs BEFORE action 6 is set, see the red-team.) |

**Red-teams:**
- **1a/1b, web.** *Steelman for Android:* one internally consistent build that claimcheck
  already guards; the web getter is new code resting on the item table's `type` field, and our
  item table is the ANDROID one (v0.682; the web payload has no item table). So the web rule runs
  on Android data, a combination neither build shipped. *Why web anyway:* the rule is code, the
  table is data, and both builds read the same table format; R6's reason (the videos are web) is
  unchanged. *Where my pick breaks:* if the web build's item table re-typed an item (say, moved a
  helmet out of type 3), our pool fires where theirs did not. Nothing we hold can check that.
  **Veto:** Android's sum (the plants `read the hair slot again` and `drop the item row's
  modifiers` are the two halves of the diff, though the second removes the table rows from BOTH
  paths; a faithful Android port would re-add them without the pool).
- **2, web with an injected clock.** *Steelman against:* until slice 2 decides where profiles come
  from, no caller has a server clock, and a live buff in a saved profile is a snapshot of a
  moment that has passed. *Where it breaks:* if slice 2's profiles carry real expiry stamps, the
  caller must choose a clock, and "now" would make every old buff dead. That choice belongs to
  slice 2 and is flagged there. **Veto:** drop the buff branches (Android).
- **3, not ported.** *Steelman for porting it:* `initDuelist` runs BEFORE `initBattleMode` sets
  action 6 (`DuelModeUI.as:410` then `:423`; web `§1t5565s0§.as:467` then `:480`), so the test reads
  whatever `action` the duel was started from. **A war room does NOT leak** (my first draft said it
  did): every battle end resets it, `action = ACTION_ADVENTURE` in `stopBattleMode`
  (`GameEngine.as:1263`). **A PvP room can:** entering one sets action 12 (`StageManager.as:403` →
  `GameEngine.setPvPRoomMode`), which holds until you leave the map, and only the RECEIVING side of a
  duel request checks for it (`NetworkManager.as:227`). So a Duel Mode fight started from inside a
  PvP room, against `buff2Expiry != 0` and no live buff, is halved in the original. Found by the
  review; that the Duel Mode button can be pressed inside a PvP room is NOT confirmed. *Why not
  ported:* the Sim has no PvP room and no war room, so the path cannot occur here. **Veto:** port
  it with the mode as an argument (the plant `port the halving test as if Duel Mode reached it` is
  its shape).

### ⚠️ ONE PATH LEFT UNMEASURED, AND REFUSED LOUDLY

`§1t17s0§.as:1717`: `_loc6_.value += _loc1_.modifierXML[_loc8_].value`. `value` is an `int`
(`§1t18s0§.as:8`); the right side is an XMLList, with no `int()` (Android wraps the same read in
`int()`, `StatsManager.as:2055`). AVM2's generic `add` concatenates strings when an operand is an
XMLList, so an own HP 5 merged with the Helmet's table HP 20 would store `"520"` → **520**. No AS3
runtime runs here (Ruffle.app is installed; no compiler is), so that is the spec's answer, not a
measured one. **The port throws `UNMEASURED` on this path** rather than guess either result.
Reach: an own modifier whose id matches its own item row's modifier, which includes the HP pool
on 4050 (any own attack roll) and on 7028 / 11034 (any own HP roll). Two tests pin the throw.
The one table row that repeats an id (2201, id 9 twice) throws on its table alone, with no own
modifiers; it is a consumable (type 10), which no equipment slot holds in play. **To close it:** compile a 5-line SWF and run it in Ruffle, or find the answer in
the Kongregate forum harvest (an item's HP jumping to hundreds would have been reported).

### THE PORT'S QUIRKS — PINNED, NOT FIXED

- **Each elemental DEFENCE reads ANOTHER element's attack** (`XMLNpc.as:334-337`, both builds,
  and the roster constructor): fire ← water, wind ← earth, water ← wind, earth ← fire.
- An item the table does not know adds NOTHING, its own modifiers included.
- A slot past the 13th is never summed, even when a long eq string grew the vector.
- Only DEFENSE adds the row's `defense` field; critical and piercing come from equipment only.
- A weapon the table lacks, or item 0, gives `minDamage = attack`, range 0, `slashUsage` 48;
  a real weapon's `slashusage` below 48 is raised to 48, and an absent one reads 48.
- A buff expiring AT the clock is dead (`>`, strict). A negative buffed attack truncates toward
  zero (-33 → -49).
- **Web-only item fields 206–208 (carried from 1a):** the web parse keeps own modifiers 206
  (xp), 207 and 208 OUT of `Item.modifiers` (`§1t17s0§.as:183-195`); the port keeps them in, so
  `findBonusStat(206, …)` can differ. No derived stat reads 206–208 and no table row carries them,
  so no output here changes. Found by the review.
- **A short eq string crashes the source, NOT ported:** `initDuelist` builds the paperdoll with
  `equipment[EQ_ARMOR].getItemID()` and friends with no null check (only the weapon is guarded,
  `XMLNpc.as:341-344`), so an eq string of fewer than 11 fields throws in both builds. The
  paperdoll is render-side and out of 1b; the record here does not read those slots.
