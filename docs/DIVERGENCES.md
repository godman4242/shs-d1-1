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
