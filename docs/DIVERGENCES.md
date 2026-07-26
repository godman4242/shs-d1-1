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
