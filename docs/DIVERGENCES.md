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
